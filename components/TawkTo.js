"use client";

import { useEffect } from "react";

/**
 * TawkTo - drops the Tawk.to live-chat widget into any page.
 *
 * Usage:
 *   <TawkTo propertyId="YOUR_PROPERTY_ID" widgetId="YOUR_WIDGET_ID" />
 *
 * Find your IDs inside your Tawk.to dashboard →
 *   Administration → Chat Widget → Direct Chat Link
 *   e.g. https://tawk.to/chat/66xxxxxxxxxxxxxxxx/1ixxxxxxx
s1.src='https://embed.tawk.to/6a5f9042db1f3a1d464793e5/1ju2kn1mn';
 * 
 *                                  ↑ propertyId      ↑ widgetId
 */
export default function TawkTo({
  propertyId = "6a5f9042db1f3a1d464793e5",
  widgetId = "1ju2kn1mn",
}) {
  useEffect(() => {
    // Guard: don't inject twice
    if (window.Tawk_API) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const s = document.createElement("script");
    s.id = "tawkto-script";
    s.async = true;
    s.charset = "UTF-8";
    s.setAttribute("crossorigin", "*");
    s.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;

    document.head.appendChild(s);

    return () => {
      // Clean up on unmount (e.g. during fast-refresh in dev)
      const existing = document.getElementById("tawkto-script");
      if (existing) existing.remove();
      delete window.Tawk_API;
      delete window.Tawk_LoadStart;
    };
  }, [propertyId, widgetId]);

  // Tawk renders its own widget — nothing to render here
  return null;
}
