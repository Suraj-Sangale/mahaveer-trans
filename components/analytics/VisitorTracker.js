"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackCustomEvent } from "@/utilities/analyticsTracker";

function TrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef("");

  useEffect(() => {
    // Expose globally
    if (typeof window !== "undefined") {
      window.trackMahaveerEvent = trackCustomEvent;
    }
  }, []);

  // Track Page Views
  useEffect(() => {
    const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    if (fullPath !== lastTrackedPath.current) {
      lastTrackedPath.current = fullPath;
      if (!pathname.startsWith("/admin")) {
        trackCustomEvent("pageview", { path: fullPath });
      }
    }
  }, [pathname, searchParams]);

  // Global Click Event Interceptor (Phone, WhatsApp, Tracking, Quote)
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const target = e.target.closest("a, button");
      if (!target) return;

      const href = target.getAttribute("href") || "";
      const text = (target.innerText || "").trim().toLowerCase();

      // Phone click
      if (href.startsWith("tel:")) {
        trackCustomEvent("phone_click", { href, label: target.innerText?.trim() });
      }
      // WhatsApp click
      else if (href.includes("wa.me") || href.includes("whatsapp") || text.includes("whatsapp")) {
        trackCustomEvent("whatsapp_click", { href, label: target.innerText?.trim() });
      }
      // Quote button click
      else if (href.includes("/quote") || text.includes("get a quote") || text.includes("request quote")) {
        trackCustomEvent("quote_intent", { href, label: target.innerText?.trim() });
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    return () => document.removeEventListener("click", handleGlobalClick, { capture: true });
  }, []);

  // Heartbeat ping every 2.5 minutes if tab is active
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        if (!pathname.startsWith("/admin")) {
          trackCustomEvent("heartbeat", { path: pathname });
        }
      }
    }, 150000);

    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}

export default function VisitorTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerInner />
    </Suspense>
  );
}
