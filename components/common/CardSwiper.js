"use client";

/**
 * CardSwiper — reusable Swiper-based card carousel
 *
 * Props:
 *   slides          {React.ReactNode[]}   Array of slide content (required)
 *   perView         {number}              Base slides per view (default 3)
 *   perViewMd       {number}              Slides per view at ≤900px (default 2)
 *   perViewSm       {number}              Slides per view at ≤640px (default 1)
 *   spaceBetween    {number}              Gap between slides in px (default 20)
 *   showNavigation  {boolean}             Show prev/next arrow buttons (default true)
 *   showPagination  {boolean}             Show dot pagination (default true)
 *   autoplay        {boolean|object}      Enable autoplay; pass object for custom options (default false)
 *   loop            {boolean}             Infinite loop (default true)
 *   className       {string}              Extra class on the wrapper div
 *   slideClassName  {string}              Extra class on each SwiperSlide
 */

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";

// Core styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Component-scoped styles
import styles from "@/styles/CardSwiper.module.css";

export default function CardSwiper({
  slides = [],
  perView = 3,
  perViewMd = 2,
  perViewSm = 1,
  spaceBetween = 20,
  showNavigation = true,
  showPagination = true,
  autoplay = false,
  loop = true,
  className = "",
  slideClassName = "",
}) {
  const [mounted, setMounted] = useState(false);
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const [paginationEl, setPaginationEl] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!slides.length) return null;

  const modules = [A11y];
  if (showNavigation) modules.push(Navigation);
  if (showPagination) modules.push(Pagination);
  if (autoplay) modules.push(Autoplay);

  const autoplayConfig =
    autoplay === true
      ? { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }
      : autoplay || false;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {mounted ? (
        <Swiper
          modules={modules}
          spaceBetween={spaceBetween}
          slidesPerView={perViewSm}
          loop={loop && slides.length > perView}
          observer={true}
          observeParents={true}
          resizeObserver={true}
          watchSlidesProgress={true}
          navigation={
            showNavigation && prevEl && nextEl
              ? { prevEl, nextEl }
              : showNavigation
              ? true
              : false
          }
          pagination={
            showPagination && paginationEl
              ? { el: paginationEl, clickable: true }
              : showPagination
              ? { clickable: true }
              : false
          }
          autoplay={autoplayConfig}
          breakpoints={{
            640: {
              slidesPerView: perViewMd,
              spaceBetween: spaceBetween,
            },
            1024: {
              slidesPerView: perView,
              spaceBetween: spaceBetween,
            },
          }}
          className={styles.swiper}
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i} className={`${styles.slide} ${slideClassName}`}>
              {slide}
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className={styles.swiper} style={{ display: "flex", gap: `${spaceBetween}px`, overflow: "hidden" }}>
          {slides.slice(0, perView).map((slide, i) => (
            <div key={i} style={{ flex: `0 0 calc((100% - ${(perView - 1) * spaceBetween}px) / ${perView})`, minWidth: 0 }}>
              {slide}
            </div>
          ))}
        </div>
      )}

      {/* Custom navigation row */}
      {showNavigation && (
        <div className={styles.navRow}>
          <button
            ref={(node) => setPrevEl(node)}
            className={`${styles.navBtn} ${styles.btnPrev}`}
            aria-label="Previous slide"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          {showPagination && (
            <div
              ref={(node) => setPaginationEl(node)}
              className={styles.pagination}
            />
          )}
          <button
            ref={(node) => setNextEl(node)}
            className={`${styles.navBtn} ${styles.btnNext}`}
            aria-label="Next slide"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}

      {/* Standalone pagination (when no navigation arrows) */}
      {!showNavigation && showPagination && (
        <div
          ref={(node) => setPaginationEl(node)}
          className={styles.pagination}
        />
      )}
    </div>
  );
}

