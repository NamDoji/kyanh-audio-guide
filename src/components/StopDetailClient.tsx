"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Map, Sparkles } from "lucide-react";
import type { Stop } from "@/types/content";
import { AudioPlayer } from "./AudioPlayer";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { usePreferences } from "./PreferenceProvider";

export function StopDetailClient({ stop, previous, next }: { stop: Stop; previous?: Stop; next?: Stop }) {
  const { lang } = usePreferences();

  return (
    <article>
      <section className="relative min-h-[56vh] overflow-hidden">
        <Image src={stop.image} alt={`${stop.title.vi} / ${stop.title.en}`} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/30 to-black/15" />
        <div className="relative mx-auto flex min-h-[56vh] max-w-7xl flex-col justify-end px-4 pb-10 pt-20 text-white sm:px-6 lg:px-8">
          <div className="mb-4 flex">
            <LanguageSwitcher />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--sand)]">
            Stop {stop.id.toString().padStart(2, "0")}
          </p>
          <h1 className="heritage-title mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            {stop.title[lang]}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/88">{stop.subtitle[lang]}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div id="audio" className="lg:sticky lg:top-24 lg:self-start">
          <AudioPlayer stop={stop} lang={lang} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {previous ? (
              <Link href={`/stops/${previous.id}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white/80 px-4 text-sm font-black tunnel:bg-stone-950/80">
                <ArrowLeft aria-hidden className="size-4" />
                {lang === "vi" ? "Điểm trước" : "Previous"}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/stops/${next.id}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--ocean)] px-4 text-sm font-black text-white">
                {lang === "vi" ? "Điểm tiếp" : "Next"}
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            ) : (
              <Link href="/feedback" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--ocean)] px-4 text-sm font-black text-white">
                {lang === "vi" ? "Gửi phản hồi" : "Feedback"}
              </Link>
            )}
          </div>
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
            <h2 className="text-xl font-black text-[var(--ink)]">{lang === "vi" ? "Bạn đang đứng ở đâu?" : "Where are you standing?"}</h2>
            <p className="mt-3 text-base leading-8 text-[var(--muted)]">{stop.location[lang]}</p>
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
          <section className="rounded-[2rem] bg-[var(--ocean)] p-6 text-white shadow-lg">
            <h2 className="text-xl font-black">{lang === "vi" ? "Suy ngẫm" : "Reflection"}</h2>
            <p className="mt-3 text-lg leading-8 text-white/88">{stop.reflection[lang]}</p>
          </section>
        </div>
      </section>
    </article>
  );
}
