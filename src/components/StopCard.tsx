"use client";

import Image from "next/image";
import Link from "next/link";
import { Headphones, MapPin } from "lucide-react";
import type { Lang, Stop } from "@/types/content";

export function StopCard({ stop, lang, compact = false }: { stop: Stop; lang: Lang; compact?: boolean }) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/88 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl tunnel:border-stone-700 tunnel:bg-stone-950/80">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={stop.image}
          alt={`${stop.title.vi} / ${stop.title.en}`}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute left-4 top-4 rounded-2xl bg-white/92 px-3 py-2 text-sm font-black text-[var(--ocean)] shadow">
          Stop {stop.id}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-black leading-tight text-[var(--ink)]">{stop.title[lang]}</h3>
          <span className="rounded-full bg-[var(--sand-soft)] px-3 py-1 text-xs font-bold text-[var(--earth)]">
            {stop.duration}
          </span>
        </div>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--muted)]">{stop.summary[lang]}</p>
        {!compact && (
          <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-[var(--ocean)]">
            <MapPin aria-hidden className="size-4" />
            {stop.location[lang]}
          </p>
        )}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link
            href={`/stops/${stop.id}`}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--ocean)] px-4 text-sm font-bold text-white shadow"
          >
            {lang === "vi" ? "Xem chi tiết" : "Open detail"}
          </Link>
          <Link
            href={`/stops/${stop.id}#audio`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--line)] px-4 text-sm font-bold text-[var(--ink)]"
          >
            <Headphones aria-hidden className="size-4" />
            {lang === "vi" ? "Nghe audio" : "Listen"}
          </Link>
        </div>
      </div>
    </article>
  );
}
