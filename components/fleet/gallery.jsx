"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { DATA } from "@/constants/data";
import styles from "@/styles/fleet.module.css";
import { applyCSS } from "../../utilities/utils";

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightbox, setLightbox] = useState(null);
  const [lbIdx, setLbIdx] = useState(0);
  const itemRefs = useRef([]);

  const photos = DATA.gallery.photos;
  const visible = photos.filter(
    (p) => activeFilter === "all" || p.cat === activeFilter,
  );

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    itemRefs.current.forEach((el) => {
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [activeFilter]);

  function openLb(idx) {
    setLbIdx(idx);
    setLightbox({
      img: visible[idx].img,
      title: visible[idx].title,
      sub: visible[idx].sub,
    });
    document.body.style.overflow = "hidden";
  }

  function closeLb() {
    setLightbox(null);
    document.body.style.overflow = "";
  }

  const prev = useCallback(() => {
    const newIdx = (lbIdx - 1 + visible.length) % visible.length;
    setLbIdx(newIdx);
    setLightbox({
      img: visible[newIdx].img,
      title: visible[newIdx].title,
      sub: visible[newIdx].sub,
    });
  }, [lbIdx, visible]);

  const next = useCallback(() => {
    const newIdx = (lbIdx + 1) % visible.length;
    setLbIdx(newIdx);
    setLightbox({
      img: visible[newIdx].img,
      title: visible[newIdx].title,
      sub: visible[newIdx].sub,
    });
  }, [lbIdx, visible]);

  useEffect(() => {
    function onKey(e) {
      if (!lightbox) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, prev, next]);

  const css = (className, mainStyles = styles, style2 = {}) => {
    return applyCSS(className, mainStyles, style2);
  };

  console.log("🚀 ~ Gallery ~ lightbox:", lightbox);
  console.log("🚀 ~ Gallery ~ DATA.gallery.tag:", DATA.gallery.tag);
  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div
          className={css("lightbox,open")}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLb();
          }}
        >
          <div className={css("lb-inner")}>
            <button className={css("lb-nav,lb-prev")} onClick={prev}>
              ‹
            </button>
            <img
              className={css("lb-img")}
              src={lightbox.img}
              alt={lightbox.title}
            />
            <button className={css("lb-nav,lb-next")} onClick={next}>
              ›
            </button>
            <button className={css("lb-close")} onClick={closeLb}>
              ✕
            </button>
            <div className={css("lb-caption")}>
              <h4>{lightbox.title}</h4>
              <p>{lightbox.sub}</p>
            </div>
          </div>
        </div>
      )}

      <section className={css("photo-gallery")}>
        <div className={css("gal-head")} id="gal-head">
          <div>
            <div className={css("sec-tag")}>"DATA.gallery.tag"</div>
            <h2 className={css("sec-h")}>
              {DATA.gallery.headingPart1}{" "}
              <span className={css("hl")}>{DATA.gallery.headingHl}</span>
            </h2>
          </div>
          <div className={css("gal-filters")}>
            {DATA.gallery.filters.map((f) => (
              <button
                key={f.id}
                className={`${css("gf-btn")} ${activeFilter === f.id ? css("active") : ""}`}
                onClick={() => setActiveFilter(f.id)}
              >
                <span className={css("gf-dot")} style={{ background: f.dot }} />
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className={css("gal-masonry")}>
          {visible.map((p, i) => (
            <div
              key={`${p.cat}-${p.title}-${i}`}
              className={css("gi")}
              data-size={p.size}
              style={{ transitionDelay: `${(i % 3) * 0.1}s` }}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              onClick={() => openLb(i)}
            >
              <img src={p.img} alt={p.title} loading="lazy" />
              <div className={css("gi-tag")}>{p.tag}</div>
              <div className={css("gi-label")}>
                <h4>{p.title}</h4>
                <p>{p.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
