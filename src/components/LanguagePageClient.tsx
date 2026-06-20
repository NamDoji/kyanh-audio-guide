"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Lang } from "@/types/content";
import { usePreferences } from "./PreferenceProvider";

export function LanguagePageClient() {
  const { lang, setLang } = usePreferences();

  const options: { code: Lang; title: string; subtitle: string }[] = [
    { code: "vi", title: "Tiếng Việt", subtitle: "Nghe thuyết minh bằng tiếng Việt" },
    { code: "en", title: "English", subtitle: "Listen to the tour in English" },
  ];

  return (
    <section className="mx-auto grid min-h-[70vh] max-w-5xl place-items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full">
        <p className="text-center text-sm font-black uppercase tracking-[0.25em] text-[var(--ocean)]">
          Language
        </p>
        <h1 className="heritage-title mt-3 text-center text-4xl font-black text-[var(--ink)] sm:text-5xl">
          Chọn ngôn ngữ / Choose language
        </h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {options.map((option) => (
            <Link
              key={option.code}
              href="/"
              onClick={() => setLang(option.code)}
              className={`rounded-[2rem] border p-7 shadow-xl transition hover:-translate-y-1 ${
                lang === option.code
                  ? "border-[var(--ocean)] bg-[var(--teal-soft)]"
                  : "border-[var(--line)] bg-white/88 tunnel:bg-stone-950/80"
              }`}
            >
              <span className="text-5xl">{option.code === "vi" ? "🇻🇳" : "🇬🇧"}</span>
              <h2 className="mt-5 text-3xl font-black text-[var(--ink)]">{option.title}</h2>
              <p className="mt-3 text-[var(--muted)]">{option.subtitle}</p>
              <span className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--ocean)] px-5 font-black text-white">
                Continue <ArrowRight aria-hidden className="size-5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
