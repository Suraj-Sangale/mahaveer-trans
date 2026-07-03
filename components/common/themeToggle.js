import React, { useId } from "react";
import styled from "styled-components";

export default function ThemeToggle({ checked, onChange }) {
  const id = useId();

  return (
    <Wrapper>
      <input id={id} type="checkbox" checked={checked} onChange={onChange} />

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
    width: 82px;
    height: 42px;
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
    width: 33px;
    height: 33px;
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
`;