"use client";
import { useEffect, useRef } from "react";
import styles from "@/styles/fleet.module.css";
import { applyCSS } from "@/utilities/utils";


export default function CanvasRoute() {
  const canvasRef = useRef(null);
    const css = (className, mainStyles = styles, style2 = {}) => {
      return applyCSS(className, mainStyles, style2);
    };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lines = Array.from({ length: 14 }, (_, i) => ({
      y: 0.12 + i * 0.065,
      speed: 0.0015 + Math.random() * 0.002,
      opacity: 0.25 + Math.random() * 0.35,
      width: 0.5 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
      amp: 0.02 + Math.random() * 0.03,
    }));

    const dots = Array.from({ length: 40 }, () => ({
      lineIdx: Math.floor(Math.random() * 14),
      t: Math.random(),
      speed: 0.001 + Math.random() * 0.003,
      r: 1.5 + Math.random() * 2.5,
    }));

    let animT = 0;
    let raf;

    function frame() {
      if (!canvas || !ctx) return;
      const section = canvas.parentElement;
      if (section) {
        canvas.width = section.clientWidth;
        canvas.height = section.clientHeight;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animT += 0.006;
      const W = canvas.width;
      const H = canvas.height;

      lines.forEach((ln) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(14,165,233,${ln.opacity})`;
        ctx.lineWidth = ln.width;
        ctx.setLineDash([8, 18]);
        ctx.lineDashOffset = -animT * 60 * ln.speed * 800;
        for (let x = 0; x <= W; x += 4) {
          const nx = x / W;
          const ny =
            ln.y + Math.sin(nx * Math.PI * 3 + animT * 1.5 + ln.phase) * ln.amp;
          if (x === 0) ctx.moveTo(x, ny * H);
          else ctx.lineTo(x, ny * H);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      });

      dots.forEach((d) => {
        d.t += d.speed;
        if (d.t > 1) d.t = 0;
        const ln = lines[d.lineIdx];
        const x = d.t * W;
        const ny =
          ln.y + Math.sin(d.t * Math.PI * 3 + animT * 1.5 + ln.phase) * ln.amp;
        const y = ny * H;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, d.r * 2.5);
        grd.addColorStop(0, "rgba(14,165,233,0.9)");
        grd.addColorStop(1, "rgba(14,165,233,0)");
        ctx.beginPath();
        ctx.arc(x, y, d.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={css("route-canvas-wrap")}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.35,
      }}
    />
  );
}
