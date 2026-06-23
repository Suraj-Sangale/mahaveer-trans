import React from "react";

import dynamic from "next/dynamic";
import ThemeInit from "./themeInit";
import Navbar from "./navbar";
import StatsRow from "./statsRow";
import Gallery from "./gallery";
import RouteMap from "./routeMap";
import ScrollReveal from "./scrollReveal";
import { DATA } from "@/constants/data";
import HeroParticles from "./HeroParticles";
import Clients from "./clients";
import CtaRevealClient from "./ctaRevealClient";
import Header from "../layout/header";
import { applyCSS } from "../../utilities/utils";
import styles from "@/styles/fleet.module.css";

export default function FleetWrapper() {
  const css = (className, mainStyles = styles, style2 = {}) => {
    return applyCSS(className, mainStyles, style2);
  };

  return (
    <>
      <ThemeInit />
      <Header />

      {/* HERO */}
      <section className={css("hero-section")}>
        <HeroParticles />
        <div className={css("hero-overlay")} />
        <div className={css("hero-inner")}>
          <div className={css("hero-eyebrow")}>
            <span className={css("live-dot")} />
            <span>{DATA.hero.eyebrow}</span>
          </div>
          <h1 className={css("hero-h1")}>
            {DATA.hero.headingLine1}{" "}
            <span className={css("hl")}>{DATA.hero.headingHl}</span>
            <br />
            <span className={css("outline")}>{DATA.hero.headingLine2}</span>
          </h1>
          <p className={css("hero-desc")}>{DATA.hero.description}</p>
          <div className={css("hero-actions")}>
            <button className={css("btn-primary")}>{DATA.hero.cta1}</button>
            <button className={css("btn-wg")}>{DATA.hero.cta2}</button>
          </div>
        </div>
        <div className={css("hero-stats-strip")}>
          {DATA.hero.stats.map((s) => (
            <div className={css("hs-card")} key={s.lbl}>
              <div className={css("hs-val")}>
                {s.val}
                <span className={css("s")}>{s.suf}</span>
              </div>
              <div className={css("hs-lbl")}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TICKER */}
      <div className={css("ticker-wrap")}>
        <div className={css("ticker")}>
          {[...DATA.ticker, ...DATA.ticker].map((t, i) => (
            <span key={i} className={css("t-item")}>
              <span className={css("t-dot")} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* STATS ROW */}
      <StatsRow />

      {/* GALLERY */}
      <Gallery />

      {/* ROUTE MAP */}
      <RouteMap />

      {/* CLIENTS */}
      <Clients />

      {/* TESTIMONIAL MARQUEE */}
      <section className={css("testimonial-marquee")}>
        <div className={css("tm-label")}>
          <ScrollReveal>
            <div className={css("sec-tag c")}>{DATA.marquee.tag}</div>
            <h2 className={css("sec-h")}>
              {DATA.marquee.headingPart1}{" "}
              <span className={css("hl")}>{DATA.marquee.headingHl}</span>
            </h2>
          </ScrollReveal>
        </div>
        <div style={{ overflow: "hidden", padding: "1.5rem 0" }}>
          <div className={css("marquee-track")}>
            {[...DATA.marquee.items, ...DATA.marquee.items].map((t, i) => (
              <div className={css("mq-card")} key={i}>
                <div className={css("mq-stars")}>{t.stars}</div>
                <p className={css("mq-text")}>&ldquo;{t.text}&rdquo;</p>
                <div className={css("mq-author")}>
                  <img className={css("mq-av")} src={t.avatar} alt={t.name} />
                  <div>
                    <div className={css("mq-name")}>{t.name}</div>
                    <div className={css("mq-role")}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={css("cta-section")}>
        <div className={css("cta-inner-center sr")} id="cta-sr">
          <div className={css("sec-tag")}>{DATA.cta.tag}</div>
          <h2 className={css("sec-h")}>
            {DATA.cta.headingPart1}{" "}
            <span className={css("hl")}>{DATA.cta.headingHl}</span>
          </h2>
          <p>{DATA.cta.description}</p>
          <div className={css("cta-btns")}>
            <button className={css("btn-w")}>{DATA.cta.btn1}</button>
            <button className={css("btn-wg")}>{DATA.cta.btn2}</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className={css("f-top")}>
          <div className={css("f-brand")}>
            <span className={css("f-brand-logo")}>{DATA.footer.logo}</span>
            <p>{DATA.footer.tagline}</p>
            <div className={css("f-socs")}>
              {DATA.footer.socials.map((s) => (
                <a key={s.label} href={s.url} className={css("f-soc")}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          {DATA.footer.columns.map((col) => (
            <div className={css("f-col")} key={col.heading}>
              <h4>{col.heading}</h4>
              <ul className={css("f-links")}>
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={css("f-bottom")}>
          <p>{DATA.footer.copyright}</p>
          <p>{DATA.footer.footerLinks}</p>
        </div>
      </footer>

      {/* FAB */}
      <button className={css("fab")}>{DATA.fab}</button>

      {/* Scroll reveal for static elements */}
      <CtaRevealClient />
    </>
  );
}
