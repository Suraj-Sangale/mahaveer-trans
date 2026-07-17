"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wraps the app with next-themes ThemeProvider.
 * - attribute="data-theme"  → matches [data-theme="dark"] in globals.css
 * - defaultTheme="system"   → respects OS preference on first visit
 * - enableSystem             → opt-in to system preference
 * - storageKey="mt-theme"   → persists choice in localStorage
 *
 * NOTE: next-themes injects an inline <script> for SSR anti-flash (FOUC
 * prevention). React 19 warns about this, but it is a known false positive —
 * the script is intentional and harmless. The suppressor below silences it.
 */
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const _orig = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag")
    ) {
      return;
    }
    _orig.apply(console, args);
  };
}

export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      storageKey="mt-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
