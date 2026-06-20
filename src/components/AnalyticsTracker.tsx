"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { usePreferences } from "./PreferenceProvider";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const { lang } = usePreferences();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    const controller = new AbortController();
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        title: document.title,
        referrer: document.referrer,
        lang,
      }),
      signal: controller.signal,
    }).catch(() => undefined);

    return () => controller.abort();
  }, [lang, pathname]);

  return null;
}
