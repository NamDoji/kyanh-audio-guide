"use client";

import Image from "next/image";
import Link from "next/link";
import { Map, Sparkles } from "lucide-react";
import type { Stop } from "@/types/content";
import { AudioPlayer } from "./AudioPlayer";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { usePreferences } from "./PreferenceProvider";

export function StopDetailClient({ stop }: { stop: Stop }) {
  const { lang } = usePreferences();

  return (
    <article>
      <section className="relative min-h-[40vh] overflow-hidden sm:min-h-[56vh]">
        <Image src={stop.image} alt={`${stop.title.vi} / ${stop.title.en}`} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/30 to-black/15" />
        <div className="relative mx-auto flex min-h-[40vh] max-w-7xl flex-col justify-end px-4 pb-8 pt-16 text-white sm:min-h-[56vh] sm:px-6 sm:pb-10 sm:pt-20 lg:px-8">
          <div className="mb-4 hidden md:flex">
            <LanguageSwitcher />
          </div>
          <h1 className="heritage-title mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            {stop.title[lang]}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/88">{stop.subtitle[lang]}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div id="audio" className="lg:sticky lg:top-24 lg:self-start">
          <AudioPlayer stop={stop} lang={lang} />
          <Link href="/map" className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--sand)] px-4 text-sm font-black text-slate-950">
            <Map aria-hidden className="size-4" />
            {lang === "vi" ? "Quay về bản đồ" : "Back to map"}
          </Link>
        </div>

        <div className="space-y-5">
          <section className="rounded-[2rem] bg-white/88 p-6 shadow-lg tunnel:bg-stone-950/80">
            <h2 className="text-xl font-black text-[var(--ink)]">{lang === "vi" ? "Tóm tắt" : "Summary"}</h2>
            <p className="mt-3 text-lg leading-9 text-[var(--muted)]">{stop.summary[lang]}</p>
          </section>
          <section className="rounded-[2rem] bg-white/88 p-6 shadow-lg tunnel:bg-stone-950/80">
            <h2 className="text-xl font-black text-[var(--ink)]">{lang === "vi" ? "Điểm đáng chú ý" : "Highlights"}</h2>
            <ul className="mt-4 grid gap-3">
              {stop.highlights[lang].map((item) => (
                <li key={item} className="flex gap-3 rounded-3xl bg-[var(--sand-soft)] p-4">
                  <Sparkles aria-hidden className="mt-1 size-5 shrink-0 text-[var(--earth)]" />
                  <span className="font-semibold leading-7 text-[var(--ink)]">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </article>
  );
}
