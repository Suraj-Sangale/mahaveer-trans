/**
 * useAppTheme — thin wrapper around next-themes' useTheme.
 *
 * Provides a stable, app-wide theme API. Import this hook anywhere in the
 * project to read or change the theme without prop-drilling.
 *
 * Usage:
 *   const { theme, isDark, toggleTheme, setTheme } = useAppTheme();
 */
"use client";
import { useTheme } from "next-themes";

export function useAppTheme() {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return {
    /** Resolved theme: "light" | "dark" */
    theme: resolvedTheme ?? "light",
    /** Shorthand boolean — true when dark mode is active */
    isDark,
    /** Toggle between light and dark */
    toggleTheme,
    /** Set an explicit theme: "light" | "dark" | "system" */
    setTheme,
  };
}
