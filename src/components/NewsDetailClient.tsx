"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import type { NewsPost } from "@/types/content";
import { usePreferences } from "./PreferenceProvider";

export function NewsDetailClient({ post }: { post: NewsPost }) {
  const { lang } = usePreferences();

  return (
    <article>
      <section className="relative min-h-[48vh] overflow-hidden">
        <Image src={post.image} alt={post.title[lang]} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/35 to-black/15" />
        <div className="relative mx-auto flex min-h-[48vh] max-w-7xl flex-col justify-end px-4 pb-10 pt-20 text-white sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm font-bold text-white/78">
            <CalendarDays className="size-4" />
            {new Date(post.publishedAt).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US")}
          </div>
          <h1 className="heritage-title mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            {post.title[lang]}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/88">{post.excerpt[lang]}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/news" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 text-sm font-bold">
          <ArrowLeft className="size-4" />
          {lang === "vi" ? "Quay lại tin tức" : "Back to news"}
        </Link>
        <div className="mt-6 rounded-[2rem] bg-white/88 p-6 shadow-lg tunnel:bg-stone-950/80">
          {post.body[lang].split("\n").filter(Boolean).map((paragraph) => (
            <p key={paragraph} className="mb-5 text-lg leading-9 text-[var(--muted)] last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </article>
  );
}
