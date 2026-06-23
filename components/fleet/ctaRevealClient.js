"use client";
import { useEffect } from "react";
import styles from "@/styles/fleet.module.css";
import { applyCSS } from "../../utilities/utils";

export default function CtaRevealClient() {
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
    const el = document.getElementById("cta-sr");
    if (el) obs.observe(el);
    // Also handle gal-head
    const galHead = document.getElementById("gal-head");
    if (galHead) obs.observe(galHead);
    return () => obs.disconnect();
  }, []);
  return null;
}
