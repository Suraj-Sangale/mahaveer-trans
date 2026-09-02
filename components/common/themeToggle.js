"use client";
import React, { useId } from "react";
import { useTheme } from "next-themes";
import styled from "styled-components";

/**
 * ThemeToggle — can be dropped anywhere in the app.
 *
 * Usage (standalone — reads/sets theme from next-themes context):
 *   <ThemeToggle />
 *
 * Usage (controlled — keeps backward-compat with header.js):
 *   <ThemeToggle checked={isDark} onChange={toggleFn} />
 */
export default function ThemeToggle({ checked, onChange }) {
  const { resolvedTheme, setTheme } = useTheme();
  const id = useId();

  // If props are provided (controlled), use them; otherwise drive from context
  const isChecked = checked !== undefined ? checked : resolvedTheme === "dark";
  const handleChange =
    onChange !== undefined
      ? onChange
      : () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <Wrapper>
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
      />

      <label htmlFor={id} className="toggle">
        <div className="sky">
          <div className="cloud cloud1" />
          <div className="cloud cloud2" />

          <div className="stars">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="thumb">
            <div className="sunMoon" />
          </div>
        </div>
      </label>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  input {
    display: none;
  }

  .toggle {
    width: 72px;
    height: 35px;
    display: block;
    cursor: pointer;
  }

  .sky {
    width: 100%;
    height: 100%;
    border-radius: 999px;
    position: relative;
    overflow: hidden;
    background: linear-gradient(180deg, #6ec8ff, #8ddcff);
    transition: background 0.65s ease;
  }

  /* ---------- Thumb ---------- */
  /* --x and --scale are combined into ONE transform so hover/active/checked
     never overwrite each other's motion mid-transition. Only these two
     custom properties change; transform itself always reads both. */

  .thumb {
    --x: 0px;
    --scale: 1;
    position: absolute;
    left: 3.5px;
    top: 4px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    transform: translateX(var(--x)) scale(var(--scale));
    transition: transform 0.65s cubic-bezier(0.45, 0, 0.2, 1);
    z-index: 10;
  }

  input:checked + .toggle .thumb {
    --x: 40px;
  }

  .toggle:hover .thumb {
    --scale: 1.05;
  }

  .toggle:active .thumb {
    --scale: 0.95;
  }

  .sunMoon {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #ffd54f;
    box-shadow:
      0 0 25px rgba(255, 213, 79, 0.8),
      inset -4px -4px 0 rgba(255, 255, 255, 0.3);
    transition: background 0.65s ease, box-shadow 0.65s ease;
    position: relative;
  }

  /* ---------- Clouds ---------- */

  .cloud {
    position: absolute;
    background: white;
    border-radius: 999px;
    transition: all 0.65s ease;
  }

  .cloud::before,
  .cloud::after {
    content: "";
    position: absolute;
    background: inherit;
    border-radius: 50%;
  }

  .cloud1 {
    width: 22px;
    height: 10px;
    top: 10px;
    left: 40px;
  }

  .cloud1::before {
    width: 12px;
    height: 12px;
    left: 3px;
    top: -5px;
  }

  .cloud1::after {
    width: 14px;
    height: 14px;
    right: 2px;
    top: -7px;
  }

  .cloud2 {
    width: 18px;
    height: 8px;
    top: 24px;
    left: 54px;
  }

  .cloud2::before {
    width: 10px;
    height: 10px;
    top: -4px;
    left: 2px;
  }

  .cloud2::after {
    width: 10px;
    height: 10px;
    right: 1px;
    top: -5px;
  }

  /* ---------- Stars ---------- */

  .stars span {
    position: absolute;
    width: 3px;
    height: 3px;
    background: white;
    border-radius: 50%;
    opacity: 0;
    transform: scale(0);
    transition: all 0.65s ease;
  }

  .stars span:nth-child(1) {
    top: 8px;
    right: 18px;
  }

  .stars span:nth-child(2) {
    top: 15px;
    right: 30px;
  }

  .stars span:nth-child(3) {
    top: 28px;
    right: 15px;
  }

  .stars span:nth-child(4) {
    top: 22px;
    right: 42px;
  }

  .stars span:nth-child(5) {
    top: 7px;
    right: 44px;
  }

  /* ---------- Checked ---------- */

  input:checked + .toggle .sky {
    background: linear-gradient(180deg, #16213e, #0f3460);
  }

  input:checked + .toggle .sunMoon {
    background: #ececec;
    box-shadow: inset -8px -4px 0 #c8c8c8;
  }

  /* Moon crater */

  input:checked + .toggle .sunMoon::before {
    content: "";
    position: absolute;
    width: 8px;
    height: 8px;
    background: #d0d0d0;
    border-radius: 50%;
    left: 9px;
    top: 10px;
  }

  input:checked + .toggle .sunMoon::after {
    content: "";
    position: absolute;
    width: 5px;
    height: 5px;
    background: #d0d0d0;
    border-radius: 50%;
    right: 9px;
    bottom: 9px;
  }

  input:checked + .toggle .cloud {
    opacity: 0;
    transform: translateY(10px);
  }

  input:checked + .toggle .stars span {
    opacity: 1;
    transform: scale(1);
  }

  input:checked + .toggle .stars span:nth-child(1) {
    transition-delay: 0.05s;
  }

  input:checked + .toggle .stars span:nth-child(2) {
    transition-delay: 0.1s;
  }

  input:checked + .toggle .stars span:nth-child(3) {
    transition-delay: 0.15s;
  }

  input:checked + .toggle .stars span:nth-child(4) {
    transition-delay: 0.2s;
  }

  input:checked + .toggle .stars span:nth-child(5) {
    transition-delay: 0.25s;
  }

  /* ---------- Responsive ---------- */

  @media (max-width: 768px) {
    .toggle {
      width: 58px;
      height: 28px;
    }

    .thumb {
      left: 3px;
      top: 3px;
      width: 20px;
      height: 20px;
    }

    input:checked + .toggle .thumb {
      --x: 32px;
    }

    .cloud1 {
      width: 17px;
      height: 8px;
      top: 8px;
      left: 32px;
    }

    .cloud1::before {
      width: 9px;
      height: 9px;
      left: 2px;
      top: -4px;
    }

    .cloud1::after {
      width: 11px;
      height: 11px;
      right: 2px;
      top: -5px;
    }

    .cloud2 {
      width: 14px;
      height: 6px;
      top: 19px;
      left: 43px;
    }

    .cloud2::before {
      width: 8px;
      height: 8px;
      top: -3px;
      left: 2px;
    }

    .cloud2::after {
      width: 8px;
      height: 8px;
      right: 1px;
      top: -4px;
    }

    .stars span:nth-child(1) { top: 6px;  right: 14px; }
    .stars span:nth-child(2) { top: 12px; right: 24px; }
    .stars span:nth-child(3) { top: 22px; right: 12px; }
    .stars span:nth-child(4) { top: 17px; right: 33px; }
    .stars span:nth-child(5) { top: 5px;  right: 35px; }

    input:checked + .toggle .sunMoon::before {
      width: 6px;
      height: 6px;
      left: 7px;
      top: 7px;
    }

    input:checked + .toggle .sunMoon::after {
      width: 4px;
      height: 4px;
      right: 7px;
      bottom: 7px;
    }
  }

  @media (max-width: 480px) {
    .toggle {
      width: 50px;
      height: 24px;
    }

    .thumb {
      left: 3px;
      top: 3px;
      width: 17px;
      height: 17px;
    }

    input:checked + .toggle .thumb {
      --x: 27px;
    }

    .cloud1 {
      width: 14px;
      height: 6px;
      top: 6px;
      left: 26px;
    }

    .cloud1::before {
      width: 7px;
      height: 7px;
      left: 2px;
      top: -3px;
    }

    .cloud1::after {
      width: 9px;
      height: 9px;
      right: 1px;
      top: -4px;
    }

    .cloud2 {
      width: 11px;
      height: 5px;
      top: 16px;
      left: 36px;
    }

    .cloud2::before {
      width: 6px;
      height: 6px;
      top: -3px;
      left: 1px;
    }

    .cloud2::after {
      width: 6px;
      height: 6px;
      right: 1px;
      top: -3px;
    }

    .stars span {
      width: 2px;
      height: 2px;
    }

    .stars span:nth-child(1) { top: 5px;  right: 12px; }
    .stars span:nth-child(2) { top: 10px; right: 20px; }
    .stars span:nth-child(3) { top: 18px; right: 10px; }
    .stars span:nth-child(4) { top: 14px; right: 28px; }
    .stars span:nth-child(5) { top: 4px;  right: 29px; }

    input:checked + .toggle .sunMoon::before {
      width: 5px;
      height: 5px;
      left: 5px;
      top: 5px;
    }

    input:checked + .toggle .sunMoon::after {
      width: 3px;
      height: 3px;
      right: 5px;
      bottom: 5px;
    }
  }
`;