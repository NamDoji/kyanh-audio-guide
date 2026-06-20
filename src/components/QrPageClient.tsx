"use client";

import type { Stop } from "@/types/content";
import { QRCodeCard } from "./QRCodeCard";
import { usePreferences } from "./PreferenceProvider";

export function QrPageClient({ stops, baseUrl }: { stops: Stop[]; baseUrl: string }) {
  const { lang } = usePreferences();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--ocean)]">QR signage</p>
        <h1 className="heritage-title mt-3 text-4xl font-black text-[var(--ink)] sm:text-5xl">
          {lang === "vi" ? "QR cho từng điểm dừng" : "QR codes for each stop"}
        </h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
          {lang === "vi"
            ? "Dùng trang này để in thử biển QR tại di tích. Mỗi QR dẫn đến slug cố định /stops/1 đến /stops/6."
            : "Use this page to prepare printable QR signage. Each QR links to a fixed slug from /stops/1 to /stops/6."}
        </p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {stops.map((stop) => (
          <QRCodeCard key={stop.id} stop={stop} lang={lang} baseUrl={baseUrl} />
        ))}
      </div>
    </section>
  );
}
