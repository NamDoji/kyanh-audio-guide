"use client";

import Link from "next/link";
import { Headphones } from "lucide-react";
import type { Lang, Stop } from "@/types/content";

export function SiteMap({ stops, lang, showOpenMapLink = true }: { stops: Stop[]; lang: Lang; showOpenMapLink?: boolean }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/86 p-5 shadow-xl tunnel:border-stone-700 tunnel:bg-stone-950/80">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--ocean)]">
            {lang === "vi" ? "Sơ đồ tuyến" : "Route map"}
          </p>
          <h2 className="mt-2 text-2xl font-black text-[var(--ink)]">
            {lang === "vi" ? `${stops.length} điểm dừng theo hành trình` : `${stops.length} stops along the route`}
          </h2>
        </div>
        {showOpenMapLink ? (
          <Link href="/map" className="min-h-11 rounded-full bg-[var(--ocean)] px-5 py-3 text-center text-sm font-bold text-white">
            {lang === "vi" ? "Mở bản đồ" : "Open map"}
          </Link>
        ) : null}
      </div>

      <div className="relative mt-6 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#dff6f1] via-[#f7e7b0] to-[#7b4d31] p-5 tunnel:from-stone-900 tunnel:via-stone-800 tunnel:to-[#3b2619]">
        <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.85),transparent_32%),linear-gradient(90deg,rgba(0,108,128,.22),transparent)]" />
        <svg viewBox="0 0 100 100" className="relative h-[360px] w-full" role="img" aria-label="Illustrated visitor route map">
          <path
            d="M10 80 C23 70 26 63 38 57 C51 50 51 42 64 36 C73 31 80 24 90 17"
            fill="none"
            stroke="rgba(23,32,51,.72)"
            strokeWidth="1.8"
            strokeDasharray="4 3"
          />
          <path d="M0 83 C14 79 27 89 42 82 C56 75 67 82 100 74 L100 100 L0 100 Z" fill="rgba(0,108,128,.28)" />
          <path d="M0 93 C20 87 38 99 60 91 C76 84 88 88 100 82 L100 100 L0 100 Z" fill="rgba(0,108,128,.38)" />
        </svg>
        {stops.map((stop) => (
          <Link
            key={stop.id}
            href={`/stops/${stop.id}`}
            aria-label={lang === "vi" ? `Mở điểm dừng ${stop.id}: ${stop.title.vi}` : `Open stop ${stop.id}: ${stop.title.en}`}
            title={stop.title[lang]}
            className="absolute grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-[#fff7e7] bg-[var(--ocean)] text-sm font-black text-white shadow-lg transition hover:scale-110 hover:bg-[var(--earth)] focus-visible:outline-4 focus-visible:outline-white"
            style={{ left: `${stop.mapPosition.x}%`, top: `${stop.mapPosition.y}%` }}
          >
            {stop.id}
          </Link>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {stops.map((stop) => (
          <Link
            key={stop.id}
            href={`/stops/${stop.id}`}
            className="flex min-h-16 items-center gap-3 rounded-3xl border border-[var(--line)] bg-white/80 p-3 transition hover:-translate-y-0.5 hover:shadow-md tunnel:bg-stone-900/80"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--earth)] text-sm font-black text-white">
              {stop.id}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-black text-[var(--ink)]">{stop.title[lang]}</span>
              <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-[var(--muted)]">
                <Headphones aria-hidden className="size-3" />
                {stop.duration}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
