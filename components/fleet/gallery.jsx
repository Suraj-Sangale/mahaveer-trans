"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import styles from "@/styles/fleet.module.css";
import { applyCSS } from "../../utilities/utils";
import GalleryNew from "./gallaryNew";


/* ─────────────────────────────────────────────────────────────
   COLUMN CONFIG — alternating up / down parallax
   speed: positive  →  column drifts DOWN while scrolling down
          negative  →  column drifts UP  while scrolling down
   offset: initial vertical nudge so columns don't start flush
───────────────────────────────────────────────────────────── */
const COLS = [
  { speed: -0.18, offset: 0 },   // col 1 → UP
  { speed:  0.12, offset: -60 },  // col 2 → DOWN (offset up)
  { speed: -0.15, offset: 0 },   // col 3 → UP
  { speed:  0.09, offset: 0 },   // col 4 → DOWN
];

const LERP_FACTOR = 0.08; // smoothing — lower = silkier, higher = snappier

export default function Gallery({ DATA }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightbox, setLightbox]         = useState(null);
  const [lbIdx, setLbIdx]               = useState(0);

  const colRefs  = useRef([]);          // 4 column DOM nodes
  const rafRef   = useRef(null);
  const currY    = useRef(0);           // lerped scroll value
  const targetY  = useRef(0);          // raw scroll value

  const photos  = DATA.gallery.photos;
  const visible = photos.filter(
    (p) => activeFilter === "all" || p.cat === activeFilter
  );

  /* ── Distribute photos round-robin into 4 columns ──
     Pad each column to MIN_PER_COL by cycling through visible[]
     so no column ever has empty space at top or bottom.          */
  const MIN_PER_COL = 10;
  const totalNeeded = Math.max(visible.length, MIN_PER_COL * 4);
  const columns = [[], [], [], []];
  for (let i = 0; i < totalNeeded; i++) {
    const p = visible[i % visible.length]; // cycle if we run out
    columns[i % 4].push({ ...p, idx: i % visible.length, key: i });
  }

  // Prepend one extra image at the top (-1 position) of col 2 and col 4
  if (visible.length > 0) {
    const extra2 = visible[visible.length - 1];               // last photo → col 2
    const extra4 = visible[(visible.length - 2 + visible.length) % visible.length]; // 2nd-last → col 4
    columns[1].unshift({ ...extra2, idx: visible.length - 1, key: -1 });
    columns[3].unshift({ ...extra4, idx: (visible.length - 2 + visible.length) % visible.length, key: -2 });
  }

  /* ── rAF scroll-parallax loop ── */
  useEffect(() => {
    // Record scroll position at mount — parallax is relative to this baseline
    // so columns always start perfectly aligned (y=0) when first visible.
    const baseline = window.scrollY;

    const onScroll = () => {
      targetY.current = window.scrollY - baseline;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const tick = () => {
      // lerp current toward target
      currY.current += (targetY.current - currY.current) * LERP_FACTOR;

      colRefs.current.forEach((el, i) => {
        if (!el) return;
        const cfg = COLS[i];
        const y = cfg.offset + currY.current * cfg.speed;
        el.style.transform = `translate3d(0, ${y}px, 0)`;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    // start at zero delta
    targetY.current = 0;
    currY.current   = 0;
    rafRef.current  = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ── Lightbox helpers ── */
  function openLb(globalIdx) {
    const p = visible[globalIdx];
    setLbIdx(globalIdx);
    setLightbox({ img: p.img, title: p.title, sub: p.sub });
    document.body.style.overflow = "hidden";
  }

  function closeLb() {
    setLightbox(null);
    document.body.style.overflow = "";
  }

  const prev = useCallback(() => {
    const i = (lbIdx - 1 + visible.length) % visible.length;
    setLbIdx(i);
    setLightbox({ img: visible[i].img, title: visible[i].title, sub: visible[i].sub });
  }, [lbIdx, visible]);

  const next = useCallback(() => {
    const i = (lbIdx + 1) % visible.length;
    setLbIdx(i);
    setLightbox({ img: visible[i].img, title: visible[i].title, sub: visible[i].sub });
  }, [lbIdx, visible]);

  useEffect(() => {
    const onKey = (e) => {
      if (!lightbox) return;
      if (e.key === "Escape")      closeLb();
      if (e.key === "ArrowLeft")   prev();
      if (e.key === "ArrowRight")  next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, prev, next]);

  const css = (cls) => applyCSS(cls, styles, {});

  /* ── Aspect-ratio helpers for visual rhythm ── */
  function aspectForSize(size) {
    if (size === "tall")   return "3/4";
    if (size === "short")  return "4/3";
    return "1/1";
  }

  return (
    <>
      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className={css("lightbox,open")}
          onClick={(e) => { if (e.target === e.currentTarget) closeLb(); }}
        >
          <div className={css("lb-inner")}>
            <button className={css("lb-nav,lb-prev")} onClick={prev}>‹</button>
            <img className={css("lb-img")} src={lightbox.img} alt={lightbox.title} />
            <button className={css("lb-nav,lb-next")} onClick={next}>›</button>
            <button className={css("lb-close")} onClick={closeLb}>✕</button>
            <div className={css("lb-caption")}>
              <h4>{lightbox.title}</h4>
              <p>{lightbox.sub}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Section header + filters ── */}
      <section className={css("photo-gallery")}>
        <div className={css("gal-head")} id="gal-head">
          <div>
            <div className={css("sec-tag")}>{DATA.gallery.tag}</div>
            <h2 className={css("sec-h")}>
              {DATA.gallery.headingPart1}{" "}
              <span className={css("hl")}>{DATA.gallery.headingHl}</span>
            </h2>
          </div>
          <div className={css("gal-filters")}>
            {/* {DATA.gallery.filters.map((f) => (
              <button
                key={f.id}
                className={`${css("gf-btn")} ${activeFilter === f.id ? css("active") : ""}`}
                onClick={() => setActiveFilter(f.id)}
              >
                <span className={css("gf-dot")} style={{ background: f.dot }} />
                {f.label}
              </button>
            ))} */}
          </div>
        </div>

        {/* ── 4-column parallax grid ── */}
        {/* <div className={css("pg-outer")}>
          {columns.map((col, ci) => (
            <div
              key={ci}
              className={css("pg-col")}
              ref={(el) => { colRefs.current[ci] = el; }}
              style={{ willChange: "transform" }}
            >
              {col.map((p) => (
                <div
                  key={p.key}
                  className={css("pg-item")}
                  data-size={p.size}
                  onClick={() => openLb(p.idx)}
                >
                  <img src={p.img} alt={p.title} loading="lazy" />
                  <div className={css("pg-overlay")}>
                    <span className={css("pg-tag")}>{p.tag}</span>
                    <div className={css("pg-label")}>
                      <h4>{p.title}</h4>
                      <p>{p.sub}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div> */}
        <GalleryNew DATA={DATA} />
      </section>
    </>
  );
}
