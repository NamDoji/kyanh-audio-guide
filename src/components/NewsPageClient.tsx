"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Newspaper } from "lucide-react";
import type { NewsPost } from "@/types/content";
import { usePreferences } from "./PreferenceProvider";

export function NewsPageClient({ posts }: { posts: NewsPost[] }) {
  const { lang } = usePreferences();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--ocean)]">
          {lang === "vi" ? "Tin tức" : "News"}
        </p>
        <h1 className="heritage-title mt-3 text-4xl font-black text-[var(--ink)] sm:text-5xl">
          {lang === "vi" ? "Cập nhật từ Địa đạo Kỳ Anh" : "Updates from Ky Anh"}
        </h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
          {lang === "vi"
            ? "Thông báo, hoạt động và nội dung mới cho khách tham quan."
            : "Announcements, activities and new visitor information."}
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/news/${post.id}`}
            className="group overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-white/90 shadow-lg transition hover:-translate-y-1 hover:shadow-xl tunnel:bg-stone-950/80"
          >
            <div className="relative h-48">
              <Image src={post.image} alt={post.title[lang]} fill className="object-cover transition group-hover:scale-105" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                <CalendarDays className="size-4" />
                {new Date(post.publishedAt).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US")}
              </div>
              <h2 className="mt-3 text-xl font-black leading-tight text-[var(--ink)]">{post.title[lang]}</h2>
              <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--muted)]">{post.excerpt[lang]}</p>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="mt-10 rounded-[2rem] border-2 border-dashed border-[var(--line)] p-12 text-center">
          <Newspaper className="mx-auto size-10 text-[var(--muted)]" />
          <p className="mt-3 font-bold text-[var(--muted)]">
            {lang === "vi" ? "Chưa có tin tức được xuất bản." : "No published news yet."}
          </p>
        </div>
      ) : null}
    </section>
  );
}
