"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";



const GSAP_SRC = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
const SCROLLTRIGGER_SRC =
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";

/* Direction pattern for 4 columns: up, down, up, down */
const DIRECTIONS = ["up", "down", "up", "down"];

/* Minimum items per column so the parallax has enough content */
const MIN_PER_COL = 8;


function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function GalleryNew({ DATA }) {
  /* ── Build photo list from props ── */
  const photos = DATA?.gallery?.photos ?? [];

  /* Distribute photos round-robin into 4 columns, padding to MIN_PER_COL */
  const totalNeeded = Math.max(photos.length, MIN_PER_COL * 4);
  const columns = [[], [], [], []];
  if (photos.length > 0) {
    for (let i = 0; i < totalNeeded; i++) {
      const p = photos[i % photos.length];
      columns[i % 4].push({ ...p, flatIdx: i % photos.length, key: i });
    }
  }

  /* ── Lightbox state ── */
  const [lbPhoto, setLbPhoto] = useState(null);
  const [lbIdx,   setLbIdx]   = useState(0);

  const openLb = useCallback((flatIdx) => {
    const p = photos[flatIdx];
    if (!p) return;
    setLbIdx(flatIdx);
    setLbPhoto({ img: p.img, title: p.title, sub: p.sub });
    document.body.style.overflow = "hidden";
  }, [photos]);

  const closeLb = useCallback(() => {
    setLbPhoto(null);
    document.body.style.overflow = "";
  }, []);

  const prev = useCallback(() => {
    const i = (lbIdx - 1 + photos.length) % photos.length;
    setLbIdx(i);
    setLbPhoto({ img: photos[i].img, title: photos[i].title, sub: photos[i].sub });
  }, [lbIdx, photos]);

  const next = useCallback(() => {
    const i = (lbIdx + 1) % photos.length;
    setLbIdx(i);
    setLbPhoto({ img: photos[i].img, title: photos[i].title, sub: photos[i].sub });
  }, [lbIdx, photos]);

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e) => {
      if (!lbPhoto) return;
      if (e.key === "Escape")     closeLb();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lbPhoto, closeLb, prev, next]);

  /* ── Refs for GSAP / parallax ── */
  const gallerySectionRef  = useRef(null);
  const galleryViewportRef = useRef(null);
  const columnRefs = useRef([]);
  columnRefs.current = [];

  const addColumnRef = (el) => {
    if (el && !columnRefs.current.includes(el)) columnRefs.current.push(el);
  };


  useEffect(() => {
    let cancelled = false;
    const cleanupFns = [];

    async function init() {
      try {
        await loadScript(GSAP_SRC);
        await loadScript(SCROLLTRIGGER_SRC);
      } catch (err) {
        console.error("Failed to load GSAP from CDN", err);
        return;
      }
      if (cancelled) return;

      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      if (!gsap || !ScrollTrigger) return;

      gsap.registerPlugin(ScrollTrigger);

      const gallerySection  = gallerySectionRef.current;
      const galleryViewport = galleryViewportRef.current;
      const cols            = columnRefs.current.filter(Boolean);
      if (!gallerySection || !galleryViewport || !cols.length) return;

      /* =========================================================
         1. Vanilla scroll-driven column parallax
         (identical math/logic to the original <script>)
      ========================================================= */
      const movementAmount = 950;
      let ticking = false;

      const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

      function updateGallery() {
        const sectionRect = gallerySection.getBoundingClientRect();
        const screenHeight = window.innerHeight;
        const sectionHeight = gallerySection.offsetHeight;
        const totalDistance = screenHeight + sectionHeight;
        const scrolled = clamp(screenHeight - sectionRect.top, 0, totalDistance);
        const progress = scrolled / totalDistance;
        const movement = progress * movementAmount;

        cols.forEach((column) => {
          const direction = column.dataset.direction;
          column.style.transform =
            direction === "up"
              ? `translate3d(0, ${-movement}px, 0)`
              : `translate3d(0, ${movement}px, 0)`;
        });

        ticking = false;
      }

      function requestUpdate() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
          updateGallery();
          ticking = false;
        });
      }

      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate, { passive: true });
      updateGallery();

      cleanupFns.push(() => {
        window.removeEventListener("scroll", requestUpdate);
        window.removeEventListener("resize", requestUpdate);
      });

      /* 2. Gallery items — staggered fade-in per column on scroll-into-view */
      const scrollTriggers = [];
      cols.forEach((col, colIdx) => {
        const items = col.querySelectorAll(".spg-item");
        const st = ScrollTrigger.create({
          trigger: gallerySection,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.to(items, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.07,
              delay: colIdx * 0.1,
            });
          },
        });
        scrollTriggers.push(st);
      });

      cleanupFns.push(() => scrollTriggers.forEach((t) => t.kill()));

      /* 3. 3D tilt on hover */
      const items = galleryViewport.querySelectorAll(".spg-item");
      const hoverHandlers = [];

      items.forEach((card) => {
        const onMove = (e) => {
          const rect = card.getBoundingClientRect();
          const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

          gsap.to(card, {
            rotateY: dx * 9,
            rotateX: -dy * 9,
            transformPerspective: 700,
            transformOrigin: "center center",
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const onLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.55,
            ease: "elastic.out(1, 0.65)",
            overwrite: "auto",
          });
        };

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        hoverHandlers.push({ card, onMove, onLeave });
      });

      cleanupFns.push(() => {
        hoverHandlers.forEach(({ card, onMove, onLeave }) => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });
    }

    init();
    return () => { cancelled = true; cleanupFns.forEach((fn) => fn()); };
  }, []);

  return (
    <>
      <style>{`
        /* ─── Lightbox ─── */
        .spg-lightbox {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(6px);
          animation: spgLbIn .25s ease;
        }
        @keyframes spgLbIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .spg-lb-inner {
          position: relative;
          display: flex;
          align-items: center;
          gap: 16px;
          max-width: 90vw;
          max-height: 90vh;
        }
        .spg-lb-img {
          display: block;
          max-width: 80vw;
          max-height: 85vh;
          border-radius: 12px;
          object-fit: contain;
          box-shadow: 0 24px 60px rgba(0,0,0,.6);
          animation: spgImgIn .3s cubic-bezier(.4,0,.2,1);
        }
        @keyframes spgImgIn {
          from { transform: scale(.92); opacity: 0; }
          to   { transform: scale(1);  opacity: 1; }
        }
        .spg-lb-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.25);
          color: #fff;
          font-size: 2rem;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .2s;
          z-index: 2;
        }
        .spg-lb-nav:hover { background: rgba(255,255,255,.28); }
        .spg-lb-prev { left: -60px; }
        .spg-lb-next { right: -60px; }
        .spg-lb-close {
          position: absolute;
          top: -48px;
          right: 0;
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.25);
          color: #fff;
          font-size: 1.2rem;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .2s;
        }
        .spg-lb-close:hover { background: rgba(255,255,255,.28); }
        .spg-lb-caption {
          position: absolute;
          bottom: -56px;
          left: 0; right: 0;
          text-align: center;
          color: #fff;
        }
        .spg-lb-caption h4 { margin: 0 0 4px; font-size: 1rem; font-weight: 600; }
        .spg-lb-caption p  { margin: 0; font-size: .82rem; color: rgba(255,255,255,.65); }

        /* ─── Gallery ─── */
        .spg-root * { box-sizing: border-box; }
        .spg-root .gallery-section {
          position: relative;
          height: 300vh;
        }
        .spg-root .gallery-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .spg-root .gallery-viewport {
          position: relative;
          width: 99%;
          height: 85%;
          margin: 0 auto;
          overflow: hidden;
        }
        .spg-root .gallery-viewport::after {
          content: "";
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 75px;
          z-index: 50;
          pointer-events: none;
          background: linear-gradient(to top, rgba(0,0,0,0.15), transparent);
        }
        .spg-root .gallery-content {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
          padding: 0 35px;
          transform: translateY(-50%);
        }
        .spg-root .gallery-column {
          display: flex;
          flex-direction: column;
          gap: 29px;
          will-change: transform;
        }
        .spg-root .gallery-column:nth-child(1) { padding-top: 0; }
        .spg-root .gallery-column:nth-child(2) { padding-top: 70px; }
        .spg-root .gallery-column:nth-child(3) { padding-top: 25px; }
        .spg-root .gallery-column:nth-child(4) { padding-top: 90px; }

        /* ─── Gallery item ─── */
        .spg-root .spg-item {
          position: relative;
          width: 100%;
          aspect-ratio: .72;
          flex-shrink: 0;
          overflow: hidden;
          background: #a5d8f7;
          border-radius: 10px;
          cursor: pointer;
          opacity: 0;
          transform: translateY(40px) scale(0.95);
        }
        .spg-root .spg-item img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .4s ease;
        }
        .spg-root .spg-item:hover img { transform: scale(1.06); }

        /* hover overlay */
        .spg-root .spg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,.55) 0%, transparent 55%);
          opacity: 0;
          transition: opacity .3s ease;
          display: flex;
          align-items: flex-end;
          padding: 12px;
        }
        .spg-root .spg-item:hover .spg-overlay { opacity: 1; }
        .spg-root .spg-label { color: #fff; }
        .spg-root .spg-label h4 { margin: 0 0 2px; font-size: .82rem; font-weight: 600; line-height: 1.2; }
        .spg-root .spg-label p  { margin: 0; font-size: .72rem; color: rgba(255,255,255,.75); }

        /* ─── Responsive ─── */
        @media (max-width: 800px) {
          .spg-root .gallery-content { grid-template-columns: repeat(3, 1fr); gap: 15px; padding: 0 20px; }
          .spg-root .gallery-column:nth-child(4) { display: none; }
          .spg-root .gallery-viewport { width: 94vw; height: 450px; }
        }
        @media (max-width: 550px) {
          .spg-root .gallery-content { grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 0 12px; }
          .spg-root .gallery-column:nth-child(3),
          .spg-root .gallery-column:nth-child(4) { display: none; }
          .spg-root .gallery-viewport { width: 96vw; height: 380px; }
          .spg-root .gallery-column { gap: 12px; }
          .spg-lb-prev { left: -44px; }
          .spg-lb-next { right: -44px; }
        }
      `}</style>

      {/* ── Lightbox ── */}
      {lbPhoto && (
        <div
          className="spg-lightbox"
          onClick={(e) => { if (e.target === e.currentTarget) closeLb(); }}
        >
          <div className="spg-lb-inner">
            <button className="spg-lb-nav spg-lb-prev" onClick={prev} aria-label="Previous">‹</button>
            <img
              className="spg-lb-img"
              src={lbPhoto.img}
              alt={lbPhoto.title || "Gallery image"}
              key={lbPhoto.img}
            />
            <button className="spg-lb-nav spg-lb-next" onClick={next} aria-label="Next">›</button>
            <button className="spg-lb-close" onClick={closeLb} aria-label="Close">✕</button>
            {(lbPhoto.title || lbPhoto.sub) && (
              <div className="spg-lb-caption">
                {lbPhoto.title && <h4>{lbPhoto.title}</h4>}
                {lbPhoto.sub   && <p>{lbPhoto.sub}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Gallery grid ── */}
      <div className="spg-root">
        <section className="gallery-section" ref={gallerySectionRef}>
          <div className="gallery-sticky">
            <div className="gallery-viewport" ref={galleryViewportRef}>
              <div className="gallery-content">
                {columns.map((col, colIdx) => (
                  <div
                    className="gallery-column"
                    data-direction={DIRECTIONS[colIdx]}
                    ref={addColumnRef}
                    key={colIdx}
                  >
                    {col.map((p) => (
                      <div
                        className="spg-item"
                        key={p.key}
                        onClick={() => openLb(p.flatIdx)}
                      >
                        <img
                          src={p.img}
                          alt={p.title || `Gallery image ${p.flatIdx + 1}`}
                          loading="lazy"
                        />
                        <div className="spg-overlay">
                          <div className="spg-label">
                            {p.title && <h4>{p.title}</h4>}
                            {p.sub   && <p>{p.sub}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}