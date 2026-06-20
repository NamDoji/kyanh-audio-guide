"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Headphones, QrCode, ShieldCheck } from "lucide-react";
import type { SiteContent } from "@/types/content";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SafetyNotes } from "./SafetyNotes";
import { SiteMap } from "./SiteMap";
import { StopCard } from "./StopCard";
import { usePreferences } from "./PreferenceProvider";

export function HomeClient({ content }: { content: SiteContent }) {
  const { lang } = usePreferences();
  const stops = content.stops;
  const latestNews = content.news.filter((post) => post.status === "published").slice(0, 3);

  return (
    <>
      <section className="wave-divider relative min-h-[82vh] overflow-hidden" style={{ "--wave": "var(--shell)" } as React.CSSProperties}>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,108,128,.92),rgba(0,166,166,.58)_42%,rgba(123,77,49,.78)),url('/images/coastal-village.svg')] bg-cover bg-center" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--shell)] to-transparent" />
        <div className="relative mx-auto flex min-h-[82vh] max-w-7xl flex-col justify-end px-4 pb-20 pt-24 sm:px-6 lg:px-8">
          <div className="max-w-4xl fade-in">
            <div className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/35 bg-white/16 px-4 text-sm font-bold text-white backdrop-blur">
              <Headphones aria-hidden className="size-4" />
              {lang === "vi" ? "Audio guide tại điểm dừng QR" : "QR-based onsite audio guide"}
            </div>
            <h1 className="heritage-title mt-6 max-w-4xl text-5xl font-black leading-[1.02] text-white drop-shadow-xl sm:text-6xl lg:text-7xl">
              {content.site.name[lang]}
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-medium leading-9 text-white/92">
              {content.site.tagline[lang]}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/stops"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[var(--sand)] px-6 text-base font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5"
              >
                {lang === "vi" ? "Bắt đầu tham quan" : "Start the tour"}
                <ArrowRight aria-hidden className="size-5" />
              </Link>
              <Link
                href="/language"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/45 bg-white/14 px-6 text-base font-black text-white backdrop-blur transition hover:bg-white/22"
              >
                {lang === "vi" ? "Chọn ngôn ngữ" : "Choose language"}
              </Link>
            </div>
            <div className="mt-6">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div className="rounded-[2rem] border border-white/70 bg-white/88 p-6 shadow-xl tunnel:border-stone-700 tunnel:bg-stone-950/80">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--ocean)]">
            {lang === "vi" ? "Giới thiệu" : "Introduction"}
          </p>
          <h2 className="heritage-title mt-3 text-3xl font-black leading-tight text-[var(--ink)]">
            {lang === "vi" ? "Di tích Lịch sử Quốc gia giữa làng quê ven biển" : "A National Historical Site in a coastal village"}
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            {lang === "vi"
              ? "Địa đạo Kỳ Anh được xây dựng từ năm 1965, hệ thống dài khoảng 32 km và từng che chở hơn 1.500 người. Website này giúp khách tham quan tự nghe câu chuyện tại từng điểm dừng bằng điện thoại."
              : "Built from 1965, the Ky Anh tunnel network stretched around 32 kilometres and once sheltered more than 1,500 people. This website lets visitors hear each stop’s story directly on their phones."}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["1965", lang === "vi" ? "khởi công" : "begun"],
              ["32 km", lang === "vi" ? "hệ thống" : "network"],
              ["1,500+", lang === "vi" ? "người được che chở" : "people sheltered"],
            ].map(([value, label]) => (
              <div key={value} className="rounded-3xl bg-[var(--sand-soft)] p-4">
                <p className="text-2xl font-black text-[var(--earth)]">{value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[340px] overflow-hidden rounded-[2rem] shadow-xl">
          <Image src="/images/tunnel-entrance.svg" alt="Ky Anh tunnel entrance illustration" fill className="object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <SafetyNotes />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SiteMap stops={stops} lang={lang} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--ocean)]">
              {lang === "vi" ? "Danh sách điểm dừng" : "Stops"}
            </p>
            <h2 className="heritage-title mt-2 text-3xl font-black text-[var(--ink)]">
              {lang === "vi" ? "Nghe câu chuyện theo từng điểm" : "Listen stop by stop"}
            </h2>
          </div>
          <Link href="/qr" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--earth)] px-5 text-sm font-black text-white">
            <QrCode aria-hidden className="size-5" />
            {lang === "vi" ? "QR tại mỗi điểm" : "QR at each stop"}
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {stops.map((stop) => (
            <StopCard key={stop.id} stop={stop} lang={lang} />
          ))}
        </div>
      </section>

      {latestNews.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--ocean)]">
                {lang === "vi" ? "Tin tức" : "News"}
              </p>
              <h2 className="heritage-title mt-2 text-3xl font-black text-[var(--ink)]">
                {lang === "vi" ? "Cập nhật mới nhất" : "Latest updates"}
              </h2>
            </div>
            <Link href="/news" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--line)] bg-white px-5 text-sm font-black">
              {lang === "vi" ? "Xem tất cả" : "View all"}
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {latestNews.map((post) => (
              <Link key={post.id} href={`/news/${post.id}`} className="rounded-[1.75rem] border border-[var(--line)] bg-white/90 p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                  <CalendarDays className="size-4" />
                  {new Date(post.publishedAt).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US")}
                </div>
                <h3 className="mt-3 text-lg font-black leading-tight text-[var(--ink)]">{post.title[lang]}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--muted)]">{post.excerpt[lang]}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-[var(--ocean)] p-6 text-white shadow-xl sm:p-8 lg:flex lg:items-center lg:justify-between">
          <div>
            <ShieldCheck aria-hidden className="size-10 text-[var(--sand)]" />
            <h2 className="mt-4 text-2xl font-black">
              {lang === "vi" ? "Quét QR tại mỗi điểm để nghe đúng nội dung" : "Scan the QR at each stop for the right story"}
            </h2>
            <p className="mt-2 max-w-2xl text-white/85">
              {lang === "vi"
                ? "Mỗi biển QR dẫn đến trang riêng của điểm dừng, giúp khách nghe đúng audio tại vị trí đang đứng."
                : "Each QR sign links to its stop page so visitors hear the correct audio where they stand."}
            </p>
          </div>
          <Link href="/stops/1" className="mt-5 inline-flex min-h-14 items-center justify-center rounded-full bg-white px-6 font-black text-[var(--ocean)] lg:mt-0">
            {lang === "vi" ? "Bắt đầu từ điểm 1" : "Start at stop 1"}
          </Link>
        </div>
      </section>
    </>
  );
}
