"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wraps the app with next-themes ThemeProvider.
 * - attribute="data-theme"  → matches [data-theme="dark"] in globals.css
 * - defaultTheme="light"    → light out-of-the-box
 * - enableSystem             → respects OS preference on first visit
 * - storageKey="mt-theme"   → persists choice in localStorage
 */
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
