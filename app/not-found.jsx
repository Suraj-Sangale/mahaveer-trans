"use client"
import React, { useEffect, useRef, useState, useCallback } from "react";

/* ============================================================
   Steel coil image — embedded as base64 so this component has
   zero external file dependencies. Swap this constant for your
   own asset (import, CDN URL, etc.) any time.
   ============================================================ */


/* ============================================================
   All CSS from the original HTML file, ported 1:1.
   Only change: `html, body` page-centering rules now target the
   `.crane-page` wrapper instead, so this component can be dropped
   into any existing React app without hijacking the real <body>.
   Every animation name, keyframe, timing value, and media query
   is identical to the source file.
   ============================================================ */
const styles = `
  .crane-page{z
    --bg: #0f1115;
    --bg-2: #14171d;
    --steel: #b9c2cc;
    --steel-dark: #6b7480;
    --steel-line: #2a2f38;
    --orange: #ff7a1a;
    --orange-dim: #e6690f;
    --text-dim: #9aa2ad;
    --text-bright: #eef1f4;

    /* single source of truth for the coil size — everything below reads from this */
    --coil-size: clamp(4.6rem, 16.2vw, 9.6rem);

    --crane-duration: 11s;
    --canvas-center-x: 683px;

    margin:0;
    padding:0;
    background: var(--bg);
    color: var(--text-bright);
    font-family: 'Space Grotesk', sans-serif;
    overflow-x: hidden;
    min-height: 100vh;
    /* Always dark — never inherits global theme */
    color-scheme: dark;

    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    position:relative;
    padding: 60px 20px 50px;
  }

  .crane-page, .crane-page *{ box-sizing: border-box; }

  /* ---------- background texture ---------- */
  .crane-page .grid-overlay{
    position:fixed;
    inset:0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 46px 46px;
    mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 85%);
    pointer-events:none;
    z-index:0;
  }

  .crane-page .vignette{
    position:fixed;
    inset:0;
    background: radial-gradient(ellipse 90% 80% at 50% 30%, transparent 40%, rgba(0,0,0,0.55) 100%);
    pointer-events:none;
    z-index:1;
  }

  .crane-page .fog-layer{
    position:fixed;
    inset:0;
    pointer-events:none;
    z-index:1;
    overflow:hidden;
  }
  .crane-page .fog-particle{
    position:absolute;
    border-radius:50%;
    background: radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%);
    filter: blur(2px);
    animation: crane-drift linear infinite;
  }
  @keyframes crane-drift{
    0%{ transform: translate(0,0); opacity:0; }
    10%{ opacity:1; }
    90%{ opacity:1; }
    100%{ transform: translate(var(--dx), var(--dy)); opacity:0; }
  }

  .crane-page .caution-strip{
    position:absolute;
    top:0; left:0; right:0;
    height:6px;
    background: repeating-linear-gradient(135deg, var(--orange) 0 18px, #14171d 18px 36px);
    opacity:0.85;
    z-index:2;
  }

  .crane-page .hero{
    position:relative;
    z-index:3;
    width:100%;
    max-width:1000px;
    display:flex;
    flex-direction:column;
    align-items:center;
    margin-top: clamp(60px, 12vw, 140px);
  }

  .crane-page .eyebrow{
    font-size: 0.72rem;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--orange);
    font-weight:600;
    margin-bottom: 18px;
    opacity:0;
    animation: crane-fadeUp 0.9s ease forwards 0.3s;
    display:flex;
    align-items:center;
    gap:10px;
  }
  .crane-page .eyebrow::before, .crane-page .eyebrow::after{
    content:"";
    width:26px; height:1px;
    background: var(--orange-dim);
    opacity:0.6;
  }

  .crane-page .stage{
    position:relative;
    display:flex;
    align-items:center;
    justify-content:center;
    gap: clamp(4px, 1.4vw, 18px);
    width:100%;
    padding-top: 260px;
    margin-top: -260px;
  }

  .crane-page .stage-glow{
    position:absolute;
    left:50%; top:58%;
    transform:translate(-50%,-50%);
    width: min(760px, 90vw);
    height: 420px;
    background: radial-gradient(ellipse at center, rgba(255,122,26,0.16), rgba(255,122,26,0.05) 45%, transparent 72%);
    filter: blur(10px);
    z-index:0;
    animation: crane-breathe 5s ease-in-out infinite;
  }
  @keyframes crane-breathe{
    0%,100%{ opacity:0.7; transform:translate(-50%,-50%) scale(1); }
    50%{ opacity:1; transform:translate(-50%,-50%) scale(1.05); }
  }

  .crane-page .digit{
    font-family: 'Archivo Black', sans-serif;
    font-size: clamp(5.2rem, 19vw, 11.5rem);
    line-height: 1;
    color: var(--text-bright);
    background: linear-gradient(180deg, #f2f4f6 0%, #c7ced6 45%, #8b939d 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    position:relative;
    z-index:2;
    filter: drop-shadow(0 12px 30px rgba(0,0,0,0.55));
    opacity:0;
    animation: crane-fadeUp 0.9s ease forwards 0.15s;
    user-select:none;
  }
  .crane-page .digit.second{ animation-delay: 0.35s; }

  /* coil-slot MUST match the digit's box so the coil centers exactly where the "0" belongs */
  .crane-page .coil-slot{
    position:relative;
    width: var(--coil-size);
    height: clamp(5.2rem, 19vw, 11.5rem);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:2;
    flex: 0 0 auto;
    top: 1rem;
  }

  /* ===================== CRANE ===================== */
  .crane-page .crane-rig{
    position:absolute;
    left:8%;
    top:8rem;
    width: 60px;
    max-width: 132vw;
    height: 300px;
    transform: translate(-124%, -420px);
    z-index: 5;
    animation: crane-craneJourney var(--crane-duration) cubic-bezier(.45,.05,.25,1) forwards;
    pointer-events:none;
  }

  @keyframes crane-craneJourney{
    0%{      transform: translate(-124%, -420px); }
    16%{     transform: translate(-56%, -6px); }
    22%{     transform: translate(-56%, -6px); }
    78%{     transform: translate(-56%, -6px); }
    86%{     transform: translate(-56%, -18px); }
    100%{    transform: translate(72%, -1020px); }
  }

  .crane-page .mast{
    position:absolute;
    left: 18px;
    top: 0;
    width: 16px;
    height: 294px;
    background: repeating-linear-gradient(180deg, var(--orange) 0 22px, #b85a10 22px 24px);
    box-shadow: inset -3px 0 4px rgba(0,0,0,0.4), 2px 0 6px rgba(0,0,0,0.4);
    border-radius: 2px;
  }
  .crane-page .mast::before{
    content:"";
    position:absolute;
    left:-9px; bottom:0;
    width:34px; height:14px;
    background: #23262d;
    border-radius:2px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  }
  .crane-page .mast::after{
    content:"";
    position:absolute;
    left:0; top:0;
    width:16px; height:100%;
    background: repeating-linear-gradient(45deg, transparent 0 9px, rgba(0,0,0,0.35) 9px 10px),
                repeating-linear-gradient(-45deg, transparent 0 9px, rgba(0,0,0,0.35) 9px 10px);
  }

  .crane-page .counter-jib{
    position:absolute;
    left: -78px;
    top: 26px;
    width: 96px;
    height: 8px;
    background: linear-gradient(90deg, #4a4f58, var(--orange-dim));
    border-radius: 2px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.4);
  }
  .crane-page .counterweight{
    position:absolute;
    left:-72px;
    top: 30px;
    width: 34px;
    height: 26px;
    background: linear-gradient(180deg,#3a3f47,#22262c);
    border-radius: 2px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.5);
  }

  .crane-page .boom{
    position:absolute;
    left: 26px;
    top: 22px;
    width: 480px;
    height: 9px;
    background: linear-gradient(90deg, var(--orange) 0%, var(--orange-dim) 100%);
    border-radius: 2px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.45), inset 0 -2px 3px rgba(0,0,0,0.3);
  }
  .crane-page .boom::after{
    content:"";
    position:absolute;
    inset:0;
    background: repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0 2px, transparent 2px 26px);
  }
  .crane-page .tie-cable{
    position:absolute;
    left: 30px;
    top: -108px;
    width: 1px;
    height: 130px;
    background: linear-gradient(180deg, transparent, #565c66);
    transform-origin: top center;
    transform: rotate(24deg);
  }
  .crane-page .tie-cable.two{ transform: rotate(9deg); left: 220px; }
  .crane-page .cab{
    position:absolute;
    left: 6px;
    top: 30px;
    width: 30px;
    height: 22px;
    background: linear-gradient(180deg,#3a3f47,#1c1f24);
    border: 1px solid #4a4f58;
    border-radius: 3px 3px 2px 2px;
  }
  .crane-page .cab::after{
    content:"";
    position:absolute;
    inset: 3px 4px 8px 4px;
    background: linear-gradient(160deg, rgba(255,178,110,0.5), rgba(120,150,190,0.25));
    border-radius:2px;
  }

  .crane-page .trolley{
    position:absolute;
    top: 24px;
    left: 40px;
    width: 26px;
    height: 12px;
    background: linear-gradient(180deg,#3d434c,#1d2025);
    border-radius: 2px;
    box-shadow: 0 3px 8px rgba(0,0,0,0.5);
    animation: crane-trolleyMove var(--crane-duration) cubic-bezier(.45,.05,.25,1) forwards;
  }

  @keyframes crane-trolleyMove{
    0%,20%{  left: 40px; }
    32%{     left: 440px; }
    82%{     left: 440px; }
    100%{    left: 440px; }
  }

  .crane-page .cable-assembly{
    position:absolute;
    top: 36px;
    left: 28.2rem;
    width: 2px;
    display:flex;
    flex-direction:column;
    align-items:center;
  }
  .crane-page .cable{
    width: 2px;
    background: linear-gradient(180deg, #6b7480, #3a3f47);
    height: 0px;
    animation: crane-cableLength var(--crane-duration) cubic-bezier(.45,.05,.25,1) forwards;
  }
  @keyframes crane-cableLength{
    0%,32%{   height: 0px; }
    46%{      height: 119px; }
    58%,74%{  height: 119px; }
    88%{      height: 0px; }
    100%{     height: 0px; }
  }
  .crane-page .hook{
    width: 16px;
    height: 12px;
    margin-top: -1px;
    border: 3px solid #7c8492;
    border-top: none;
    border-radius: 0 0 9px 9px;
    opacity: 1;
    animation: crane-hookFade var(--crane-duration) linear forwards;
  }
  @keyframes crane-hookFade{
    0%,31%{ opacity:0; }
    33%{ opacity:1; }
    73%{ opacity:1; }
    76%{ opacity:0; }
    100%{ opacity:0; }
  }

  /* the coil hanging from the hook — fixed square box, driven by --coil-size */
  .crane-page .coil-carried{
    width: var(--coil-size);
    margin-top: 2px;
    animation: crane-coilCarrySwing var(--crane-duration) cubic-bezier(.45,.05,.25,1) forwards;
    transform-origin: top center;
    filter: drop-shadow(0 18px 22px rgba(0,0,0,0.55));
    flex: 0 0 auto;
  }

  @keyframes crane-coilCarrySwing{
    0%,32%{   opacity:0; transform: rotate(0deg) scale(0.9); }
    34%{      opacity:1; transform: rotate(-6deg) scale(1); }
    40%{      transform: rotate(5deg) scale(1); }
    46%{      transform: rotate(-2deg) scale(1); }
    52%{      transform: rotate(0deg) scale(1); }
    58%{      opacity:1; transform: rotate(0deg) scale(1) translateY(0px); }
    60%{      opacity:1; transform: translateY(-6px) scale(1.01); }
    63%{      opacity:0; transform: translateY(2px) scale(0.98); }
    100%{     opacity:0; }
  }

  /* ===================== FINAL COIL (the "0") ===================== */
  .crane-page .coil-final{
    position:relative;
    width: var(--coil-size);
    opacity: 0;
    animation:
      crane-coilArrive 0.5s ease forwards calc(var(--crane-duration) * 0.573),
      crane-coilFloat 4.5s ease-in-out infinite calc(var(--crane-duration) * 0.627),
      crane-coilSpin 26s linear infinite calc(var(--crane-duration) * 0.627);
    filter: drop-shadow(0 20px 26px rgba(0,0,0,0.6));
  }
  @keyframes crane-coilArrive{
    0%{ opacity:0; transform: scale(0.94); }
    40%{ opacity:1; transform: scale(1.035); }
    100%{ opacity:1; transform: scale(1); }
  }
  @keyframes crane-coilFloat{
    0%,100%{ transform: translateY(0) rotate(-1.4deg); }
    50%{ transform: translateY(-7px) rotate(1.4deg); }
  }
  @keyframes crane-coilSpin{
    0%{ filter: drop-shadow(0 20px 26px rgba(0,0,0,0.6)) brightness(1); }
    50%{ filter: drop-shadow(0 20px 26px rgba(0,0,0,0.6)) brightness(1.06); }
    100%{ filter: drop-shadow(0 20px 26px rgba(0,0,0,0.6)) brightness(1); }
  }

  /* shared image styling for BOTH the carried coil and the final coil */
  .crane-page .coil{
    width: 10rem;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .crane-page .coil-final .shine{
    position:absolute;
    inset:0;
    border-radius:50%;
    overflow:hidden;
    pointer-events:none;
  }
  .crane-page .coil-final .shine::after{
    content:"";
    position:absolute;
    top:-30%;
    left:-160%;
    width:60%;
    height:160%;
    background: linear-gradient(75deg, transparent, rgba(255,255,255,0.55), transparent);
    transform: rotate(8deg);
    animation: crane-sweep 4.5s ease-in-out infinite calc(var(--crane-duration) * 0.673);
  }

  @keyframes crane-sweep{
    0%{ left:-160%; }
    16%{ left:220%; }
    100%{ left:220%; }
  }

  .crane-page .impact-ring{
    position:absolute;
    left:50%; bottom: 6px;
    width: 20px; height: 8px;
    transform: translateX(-50%) scale(0);
    border-radius:50%;
    background: radial-gradient(ellipse at center, rgba(255,122,26,0.55), transparent 70%);
    animation: crane-ringPulse 0.6s ease-out forwards calc(var(--crane-duration) * 0.559);
  }
  @keyframes crane-ringPulse{
    0%{ transform: translateX(-50%) scale(0.3); opacity:0.9; }
    100%{ transform: translateX(-50%) scale(7); opacity:0; }
  }

  @keyframes crane-fadeUp{
    from{ opacity:0; transform: translateY(18px); }
    to{ opacity:1; transform: translateY(0); }
  }

  .crane-page .copy{
    position:relative;
    z-index:3;
    text-align:center;
    margin-top: clamp(34px, 6vw, 54px);
    max-width: 520px;
    opacity:0;
    animation: crane-fadeUp 0.9s ease forwards 0.55s;
  }
  .crane-page .copy h1{
    font-size: clamp(1.4rem, 3vw, 1.9rem);
    margin: 0 0 12px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .crane-page .copy p{
    font-size: 0.98rem;
    line-height:1.6;
    color: var(--text-dim);
    margin: 0 0 34px;
  }

  .crane-page .actions{
    display:flex;
    gap:16px;
    justify-content:center;
    flex-wrap:wrap;
  }

  .crane-page .btn{
    position:relative;
    overflow:hidden;
    font-family:inherit;
    font-size:0.9rem;
    font-weight:600;
    letter-spacing:0.02em;
    padding: 14px 30px;
    border-radius: 8px;
    cursor:pointer;
    border:1px solid transparent;
    text-decoration:none;
    display:inline-flex;
    align-items:center;
    gap:9px;
    transition: transform 0.35s cubic-bezier(.2,.8,.2,1), box-shadow 0.35s ease, border-color 0.35s ease;
  }
  .crane-page .btn:active{ transform: translateY(1px) scale(0.98); }

  .crane-page .btn-primary{
    background: linear-gradient(135deg, var(--orange), var(--orange-dim));
    color: #14100b;
    box-shadow: 0 8px 24px rgba(255,122,26,0.25);
  }
  .crane-page .btn-primary::before{
    content:"";
    position:absolute;
    top:0; left:-60%;
    width:40%; height:100%;
    background: linear-gradient(115deg, transparent, rgba(255,255,255,0.55), transparent);
    transform: skewX(-20deg);
    transition: left 0.6s ease;
  }
  .crane-page .btn-primary:hover{
    transform: translateY(-3px);
    box-shadow: 0 14px 32px rgba(255,122,26,0.4);
  }
  .crane-page .btn-primary:hover::before{ left: 130%; }

  .crane-page .btn-ghost{
    background: rgba(255,255,255,0.03);
    color: var(--text-bright);
    border-color: var(--steel-line);
  }
  .crane-page .btn-ghost:hover{
    transform: translateY(-3px);
    border-color: var(--steel-dark);
    background: rgba(255,255,255,0.06);
    box-shadow: 0 10px 26px rgba(0,0,0,0.35);
  }

  .crane-page .btn svg{ width:16px; height:16px; }

  .crane-page .site-footer{
    position:relative;
    z-index:3;
    margin-top: 46px;
    font-size: 0.72rem;
    letter-spacing:0.14em;
    text-transform:uppercase;
    color: #4a505a;
    opacity:0;
    animation: crane-fadeUp 0.9s ease forwards 0.8s;
  }

  @media (prefers-reduced-motion: reduce){
    .crane-page *, .crane-page *::before, .crane-page *::after{
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
  }

  @media (max-width: 560px){
    .crane-page .stage{ gap: 2px; padding-top: 200px; margin-top: -200px; }
    .crane-page .crane-rig{ width: 420px; height: 220px; left: 59%; top: 4rem; }
    .crane-page .cable-assembly{ left: 10rem; }
    .crane-page .boom{ width: 320px; }
    .crane-page .coil{ width: 8rem; }
    .crane-page .digit{ font-size: clamp(8rem, 19vw, 11.5rem); }
    .crane-page .coil-slot{
      width: clamp(8rem, 16.2vw, 9.6rem);
      justify-content: flex-start;
    }

    @keyframes crane-trolleyMove{
      0%,20%{  left: 30px; }
      32%{     left: 150px; }
      82%{     left: 150px; }
      100%{    left: 150px; }
    }
    @keyframes crane-craneJourney{
      0%{      transform: translate(-140%, -300px); }
      16%{     transform: translate(-52%, -4px); }
      22%{     transform: translate(-52%, -4px); }
      78%{     transform: translate(-52%, -4px); }
      86%{     transform: translate(-52%, -14px); }
      100%{    transform: translate(90%, -300px); }
    }
    .crane-page .cable{
      animation: crane-cableLength var(--crane-duration) cubic-bezier(.45,.05,.25,1) forwards;
    }
    @keyframes crane-cableLength{
      0%,32%{   height: 0px; }
      46%{      height: 105px; }
      58%,74%{  height: 105px; }
      88%{      height: 0px; }
      100%{     height: 0px; }
    }
  }

  /* ---------- debug panel (dev tool only — safe to delete this whole block) ---------- */
  .crane-page .crane-debug{
    position:fixed;
    bottom:16px;
    left:16px;
    z-index:9999;
    background:#1a1d23;
    border:1px solid #333;
    border-radius:10px;
    padding:12px 14px;
    font-family:monospace;
    font-size:12px;
    color:#eee;
    width:280px;
  }
  .crane-page .crane-debug-header{
    display:flex;
    justify-content:space-between;
    margin-bottom:6px;
  }
  .crane-page .crane-debug-header button{ cursor:pointer; }
  .crane-page .crane-debug input[type="range"]{ width:100%; }
  .crane-page .crane-debug-readout{
    margin-top:8px;
    line-height:1.5;
    white-space:pre;
  }
`;

/**
 * Crane404 — animated 404 page: a crane lowers a steel coil into place
 * between two "4"s to complete "404". Ported 1:1 from the original
 * HTML/CSS/vanilla-JS build; every keyframe, timing value, and the
 * live debug/scrub panel behave identically.
 *
 * Props:
 *   coilSrc      - optional override for the coil image (defaults to the embedded steel coil)
 *   onGoHome     - optional handler for the "Go Home" button (defaults to navigating to "/")
 *   showDebug    - optional, defaults to true. Set false to hide the scrub/freeze debug panel.
 */
export default function Crane404({ coilSrc = "/image.png", onGoHome, showDebug = true }) {
  const fogLayerRef = useRef(null);
  const rigRef = useRef(null);
  const trolleyRef = useRef(null);
  const cableRef = useRef(null);
  const debugElsRef = useRef([]);

  const [duration, setDuration] = useState(11);
  const [scrub, setScrub] = useState(0);
  const [paused, setPaused] = useState(false);
  const [readout, setReadout] = useState("");

  /* ---- Force dark mode on <html> for the lifetime of this page ---- */
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.getAttribute("data-theme");
    html.setAttribute("data-theme", "dark");

    // Watch for any external toggle (navbar, system, next-themes) and snap back to dark
    const observer = new MutationObserver(() => {
      if (html.getAttribute("data-theme") !== "dark") {
        html.setAttribute("data-theme", "dark");
      }
    });
    observer.observe(html, { attributes: true, attributeFilter: ["data-theme", "class"] });

    return () => {
      observer.disconnect();
      if (prev == null) html.removeAttribute("data-theme");
      else html.setAttribute("data-theme", prev);
    };
  }, []);

  /* ---- ambient fog particles (same generation logic as the original inline <script>) ---- */
  useEffect(() => {
    const layer = fogLayerRef.current;
    if (!layer) return;

    const count = 16;
    const nodes = [];
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "fog-particle";
      const size = 60 + Math.random() * 160;
      const startX = Math.random() * 100;
      const startY = 20 + Math.random() * 80;
      const dx = (Math.random() * 160 - 80) + "px";
      const dy = -(60 + Math.random() * 140) + "px";
      const dur = 10 + Math.random() * 14;
      const delay = Math.random() * 10;
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.left = startX + "%";
      p.style.top = startY + "%";
      p.style.setProperty("--dx", dx);
      p.style.setProperty("--dy", dy);
      p.style.animationDuration = dur + "s";
      p.style.animationDelay = delay + "s";
      layer.appendChild(p);
      nodes.push(p);
    }
    return () => nodes.forEach((n) => n.remove());
  }, []);

  /* ---- read --crane-duration from CSS + collect the elements the debug panel scrubs ---- */
  useEffect(() => {
    const root = rigRef.current?.closest(".crane-page");
    if (!root) return;
    const val = parseFloat(getComputedStyle(root).getPropertyValue("--crane-duration")) || 11;
    setDuration(val);
    debugElsRef.current = Array.from(
      root.querySelectorAll(".crane-rig, .trolley, .cable, .hook, .coil-carried, .coil-final, .impact-ring")
    );
  }, []);

  const readValues = useCallback((t) => {
    const rig = rigRef.current;
    const trolley = trolleyRef.current;
    const cable = cableRef.current;
    if (!rig || !trolley || !cable) return;
    const m = new DOMMatrix(getComputedStyle(rig).transform);
    setReadout(
      `t = ${t}s / ${duration}s (${((t / duration) * 100).toFixed(1)}%)\n` +
      `crane-rig translate: ${m.m41.toFixed(1)}px, ${m.m42.toFixed(1)}px\n` +
      `trolley left: ${getComputedStyle(trolley).left}\n` +
      `cable height: ${getComputedStyle(cable).height}`
    );
  }, [duration]);

  const applyFreeze = useCallback((t) => {
    debugElsRef.current.forEach((el) => {
      el.style.animationPlayState = "paused";
      el.style.animationDelay = -t + "s";
    });
  }, []);

  const handleScrub = (e) => {
    const t = parseFloat(e.target.value);
    setScrub(t);
    setPaused(true);
    applyFreeze(t);
    readValues(t);
  };

  const togglePlay = () => {
    if (!paused) {
      applyFreeze(scrub);
      setPaused(true);
      readValues(scrub);
    } else {
      debugElsRef.current.forEach((el) => {
        el.style.animationPlayState = "";
        el.style.animationDelay = "";
      });
      setPaused(false);
    }
  };

  useEffect(() => {
    readValues(scrub);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const handleGoHome = (e) => {
    if (onGoHome) {
      e.preventDefault();
      onGoHome();
    }
  };

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div className="crane-page">
      <style>{styles}</style>

      <div className="grid-overlay"></div>
      <div className="vignette"></div>
      <div className="fog-layer" ref={fogLayerRef}></div>
      <div className="caution-strip"></div>

      <main className="hero">
        <div className="eyebrow">Site Under Maintenance &mdash; Error 404</div>

        <div className="stage">
          <div className="stage-glow"></div>

          <div className="digit">4</div>

          <div className="coil-slot">
            <div className="impact-ring"></div>
            <div className="coil-final">
              <img src={"/image.png"} className="coil" alt="Steel coil forming the number zero" />
              <div className="shine"></div>
            </div>
          </div>

          <div className="digit second">4</div>

          {/* Crane rig */}
          <div className="crane-rig" ref={rigRef}>
            <div className="counter-jib"></div>
            <div className="counterweight"></div>
            <div className="tie-cable"></div>
            <div className="tie-cable two"></div>
            <div className="boom"></div>
            <div className="mast"></div>
            <div className="cab"></div>
            <div className="trolley" ref={trolleyRef}></div>
            <div className="cable-assembly">
              <div className="cable" ref={cableRef}></div>
              <div className="hook"></div>
              <div className="coil-carried">
                <img src={coilSrc} className="coil" alt="Steel coil being lifted by crane" />
              </div>
            </div>
          </div>
        </div>

        <div className="copy">
          <h1>Oops! This page rolled away.</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <div className="actions">
            <a className="btn btn-primary" href="/" onClick={handleGoHome}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11l9-8 9 8"/>
                <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/>
              </svg>
              Go Home
            </a>
            <button className="btn btn-ghost" onClick={handleGoBack}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5"/>
                <path d="M12 19l-7-7 7-7"/>
              </svg>
              Go Back
            </button>
          </div>
        </div>

        <div className="site-footer">MahaveerTrans &middot; Yard Ops</div>
      </main>

      {showDebug && (
        <div className="crane-debug">
          <div className="crane-debug-header">
            <strong>Crane Debug</strong>
            <button onClick={togglePlay}>{paused ? "play" : "pause"}</button>
          </div>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.001}
            value={scrub}
            onChange={handleScrub}
          />
          <div className="crane-debug-readout">{readout}</div>
        </div>
      )}
    </div>
  );
}