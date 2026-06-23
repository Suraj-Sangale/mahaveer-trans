"use client";
import { useEffect, useRef } from "react";
import { DATA } from "@/constants/data";
import styles from "@/styles/fleet.module.css";
import { applyCSS } from "../../utilities/utils";

export default function Clients() {
  const headRef = useRef(null);
  const cardRefs = useRef(null);

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
    if (headRef.current) obs.observe(headRef.current);
    // cardRefs.current.forEach((el) => {
    //   if (el) obs.observe(el);
    // });
    return () => obs.disconnect();
  }, []);

  return (
    <section className={css("clients-section")}>
      <div className={css("clients-head sr")} ref={headRef}>
        <div>
          <div className={css("sec-tag")}>{DATA.clients.tag}</div>
          <h2 className={css("sec-h")}>
            {DATA.clients.headingPart1}{" "}
            <span className={css("hl")}>{DATA.clients.headingHl}</span>
          </h2>
        </div>
        <p
          style={{
            maxWidth: "310px",
            color: "var(--muted)",
            fontSize: ".88rem",
            lineHeight: "1.65",
          }}
        >
          {DATA.clients.description}
        </p>
      </div>

      <div className={css("logo-bar")}>
        {DATA.clients.logos.map((l) => (
          <span key={l} className={css("client-logo-pill")}>
            {l}
          </span>
        ))}
      </div>

      <div className={css("client-grid")}>
        {DATA.clients.cards.map((c, i) => (
          <div
            key={c.company}
            className={css("client-card")}
            style={{ transitionDelay: `${(i % 3) * 0.08}s` }}
            // ref={(el) => { cardRefs?.current?.[i] = el; }}
          >
            <div className={css("cc-img-wrap")}>
              <img
                className={css("cc-img")}
                src={c.img}
                alt={c.company}
                loading="lazy"
              />
              <span className={`cc-industry-tag ${c.tagCls}`}>
                {c.industry}
              </span>
            </div>
            <div className={css("cc-body")}>
              <div className={css("cc-company")}>
                <div className={css("cc-logo-placeholder")}>{c.icon}</div>
                <div>
                  <div className={css("cc-name")}>{c.company}</div>
                  <div className={css("cc-sector")}>{c.sector}</div>
                </div>
              </div>
              <p className={css("cc-testimonial")}>"{c.testimonial}"</p>
              <div className={css("cc-meta")}>
                <span className={css("cc-stars")}>{c.stars}</span>
                <span className={css("cc-stat")}>{c.stat}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
