"use client";
import { useEffect, useRef } from "react";
import { DATA } from "@/constants/data";
import CanvasRoute from "./canvasRoute";
import styles from "@/styles/fleet.module.css";


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
      { threshold: 0.1 }
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
      { threshold: 0.3 }
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
    <section className="route-map">
      <CanvasRoute />
      <div className="route-inner">
        <div className="route-left sr" ref={leftRef}>
          <div className="sec-tag">{DATA.routeMap.tag}</div>
          <h2 className="sec-h">
            {DATA.routeMap.headingPart1}{" "}
            <span className="hl">{DATA.routeMap.headingHl}</span>
          </h2>
          <p>{DATA.routeMap.description}</p>
          <div className="route-points">
            {DATA.routeMap.routes.map((r) => (
              <div className="rp" key={r.city}>
                <span className="rp-dot" style={{ background: r.color }} />
                <span className="rp-city">{r.city}</span>
                <span className="rp-dist">{r.dist}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="route-right sr" ref={rightRef}>
          {DATA.routeMap.cards.map((c, i) => (
            <div className="route-stat-card" key={c.label}>
              <div className="rsc-top">
                <span className="rsc-label">{c.label}</span>
                <span className={`rsc-badge ${c.badgeCls}`}>{c.badge}</span>
              </div>
              <div className="rsc-val">{c.val}</div>
              <div className="rsc-sub">{c.sub}</div>
              <div className="rsc-bar">
                <div
                  className="rsc-fill"
                  data-pct={c.barPct}
                  style={{ width: "0%" }}
                  ref={(el) => { fillRefs.current[i] = el; }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
