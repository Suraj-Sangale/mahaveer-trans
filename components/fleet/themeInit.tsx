"use client";
import { useEffect } from "react";
import styles from "@/styles/fleet.module.css";

export default function ThemeInit() {
  useEffect(() => {
    const saved = localStorage.getItem("mt-theme");
    if (saved) {
      document.documentElement.dataset.theme = saved;
    }
  }, []);
  return null;
}
