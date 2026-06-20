"use client";

import Link from "next/link";
import { Headphones, MapPin } from "lucide-react";
import type { Stop } from "@/types/content";
import { SiteMap } from "./SiteMap";
import { usePreferences } from "./PreferenceProvider";

export function MapPageClient({ stops }: { stops: Stop[] }) {
  const { lang } = usePreferences();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--ocean)]">Map</p>
        <h1 className="heritage-title mt-3 text-4xl font-black text-[var(--ink)] sm:text-5xl">
          {lang === "vi" ? "Bản đồ tuyến tham quan" : "Illustrated visitor map"}
        </h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
          {lang === "vi"
            ? "Bản đồ minh họa không thay thế chỉ dẫn thực địa. Vui lòng đi theo biển báo tại di tích."
            : "This illustrated map does not replace onsite signs. Please follow the actual route markers."}
        </p>
      </div>
      <div className="mt-8">
        <SiteMap stops={stops} lang={lang} showOpenMapLink={false} />
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stops.map((stop) => (
          <article key={stop.id} className="rounded-[1.75rem] border border-[var(--line)] bg-white/88 p-5 shadow-lg tunnel:bg-stone-950/80">
            <div className="flex items-start gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--ocean)] text-lg font-black text-white">
                {stop.id}
              </span>
              <div>
                <h2 className="text-lg font-black text-[var(--ink)]">{stop.title[lang]}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--muted)]">{stop.summary[lang]}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href={`/stops/${stop.id}#audio`} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[var(--ocean)] px-4 text-sm font-black text-white">
                <Headphones aria-hidden className="size-4" />
                {lang === "vi" ? "Nghe" : "Listen"}
              </Link>
              <Link href={`/stops/${stop.id}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--line)] px-4 text-sm font-black">
                <MapPin aria-hidden className="size-4" />
                {lang === "vi" ? "Chi tiết" : "Detail"}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
