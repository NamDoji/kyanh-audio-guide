"use client";

import Link from "next/link";
import { Compass, Menu } from "lucide-react";
import { FontSizeControl } from "./FontSizeControl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { usePreferences } from "./PreferenceProvider";

const nav = [
  { href: "/", vi: "Trang chủ", en: "Home" },
  { href: "/stops", vi: "Điểm dừng", en: "Stops" },
  { href: "/map", vi: "Bản đồ", en: "Map" },
  { href: "/news", vi: "Tin tức", en: "News" },
  { href: "/qr", vi: "QR", en: "QR" },
  { href: "/feedback", vi: "Phản hồi", en: "Feedback" },
  { href: "/admin", vi: "Admin", en: "Admin" },
];

export function Header() {
  const { lang } = usePreferences();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--shell)]/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-h-11 items-center gap-3 rounded-full pr-2" aria-label="Home">
          <span className="grid size-11 place-items-center rounded-2xl bg-[var(--ocean)] text-white shadow-lg">
            <Compass aria-hidden className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-black tracking-wide text-[var(--ink)]">Kỳ Anh</span>
            <span className="block text-xs font-semibold text-[var(--muted)]">Audio Guide</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {nav.slice(0, 6).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="min-h-11 rounded-full px-4 py-3 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--sand-soft)] hover:text-[var(--ink)]"
            >
              {item[lang]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher compact />
          <ThemeToggle />
          <FontSizeControl />
        </div>

        <Link
          href="/stops"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--earth)] px-4 text-sm font-bold text-white shadow-sm md:hidden"
          aria-label={lang === "vi" ? "Mở danh sách điểm dừng" : "Open stops list"}
        >
          <Menu aria-hidden className="size-4" />
          {lang === "vi" ? "Điểm" : "Stops"}
        </Link>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 md:hidden">
        <LanguageSwitcher compact />
        <ThemeToggle />
        <FontSizeControl />
      </div>
    </header>
  );
}
