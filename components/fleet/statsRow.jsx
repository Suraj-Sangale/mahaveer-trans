"use client";
import { useEffect, useRef, useState } from "react";
import { DATA } from "@/constants/data";
import styles from "@/styles/fleet.module.css";
import { applyCSS } from "@/utilities/utils";

function Counter({ value, suffix }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  const css = (className, mainStyles = styles, style2 = {}) => {
    return applyCSS(className, mainStyles, style2);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            let v = 0;
            const step = value / 70;
            const t = setInterval(() => {
              v = Math.min(v + step, value);
              setDisplay(Math.floor(v));
              if (v >= value) clearInterval(t);
            }, 22);
          }
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} className={css("srn-val")}>
      {display.toLocaleString()}
      <span className={css("suf")}>{suffix}</span>
    </div>
  );
}

export default function StatsRow() {
  const css = (className, mainStyles = styles, style2 = {}) => {
    return applyCSS(className, mainStyles, style2);
  };
  return (
    <div className={css("stats-row")}>
      {DATA.statsRow.map((n) => (
        <div className={css("sr-num")} key={n.label}>
          <Counter value={n.value} suffix={n.suffix} />
          <div className={css("srn-lbl")}>{n.label}</div>
        </div>
      ))}
    </div>
  );
}
