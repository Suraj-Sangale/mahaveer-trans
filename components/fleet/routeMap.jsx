"use client";
import { useEffect, useRef } from "react";
import { DATA } from "@/constants/data";
import CanvasRoute from "./canvasRoute";
import styles from "@/styles/fleet.module.css";
import { applyCSS } from "../../utilities/utils";

export default function RouteMap() {
  const fillRefs = useRef([]);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const css = (className, mainStyles = styles, style2 = {}) => {
    return applyCSS(className, mainStyles, style2);
  };

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
    [leftRef, rightRef].forEach((r) => {
      if (r.current) obs.observe(r.current);
    });

    const barObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target;
            el.style.width = el.dataset.pct + "%";
            barObs.unobserve(el);
          }
        });
      },
      { threshold: 0.3 },
    );
    fillRefs.current.forEach((el) => {
      if (el) barObs.observe(el);
    });

    return () => {
      obs.disconnect();
      barObs.disconnect();
    };
  }, []);

  return (
    <section className={css("route-map")}>
      <CanvasRoute />
      <div className={css("route-inner")}>
        <div className={css("route-left,sr")} ref={leftRef}>
          <div className={css("sec-tag")}>{DATA.routeMap.tag}</div>
          <h2 className={css("sec-h")}>
            {DATA.routeMap.headingPart1}{" "}
            <span className={css("hl")}>{DATA.routeMap.headingHl}</span>
          </h2>
          <p>{DATA.routeMap.description}</p>
          <div className={css("route-points")}>
            {DATA.routeMap.routes.map((r) => (
              <div className={css("rp")} key={r.city}>
                <span className={css("rp-dot")} style={{ background: r.color }} />
                <span className={css("rp-city")}>{r.city}</span>
                <span className={css("rp-dist")}>{r.dist}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={css("route-right,sr")} ref={rightRef}>
          {DATA.routeMap.cards.map((c, i) => (
            <div className={css("route-stat-card")} key={c.label}>
              <div className={css("rsc-top")}>
                <span className={css("rsc-label")}>{c.label}</span>
                <span className={`${css("rsc-badge")} ${c.badgeCls}`}>{c.badge}</span>
              </div>
              <div className={css("rsc-val")}>{c.val}</div>
              <div className={css("rsc-sub")}>{c.sub}</div>
              <div className={css("rsc-bar")}>
                <div
                  className={css("rsc-fill")}
                  data-pct={c.barPct}
                  style={{ width: "0%" }}
                  ref={(el) => {
                    fillRefs.current[i] = el;
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
