"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, Map, MessageSquareText, Route } from "lucide-react";
import { usePreferences } from "./PreferenceProvider";

const items = [
  { href: "/", icon: Home, vi: "Trang chủ", en: "Home" },
  { href: "/stops", icon: Route, vi: "Điểm", en: "Stops" },
  { href: "/map", icon: Map, vi: "Bản đồ", en: "Map" },
  { href: "/gioi-thieu", icon: Info, vi: "Giới thiệu", en: "About" },
  { href: "/feedback", icon: MessageSquareText, vi: "Góp ý", en: "Feedback" },
];

export function BottomNav() {
  const { lang } = usePreferences();
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-2 bottom-3 z-50 grid grid-cols-5 rounded-[1.5rem] border border-white/50 bg-white/92 p-1 shadow-2xl backdrop-blur-xl tunnel:border-stone-700 tunnel:bg-stone-950/92 md:hidden"
      aria-label="Mobile bottom navigation"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-bold transition min-[390px]:text-[11px] ${
              isActive
                ? "bg-[var(--sand-soft)] text-[var(--ocean)]"
                : "text-[var(--muted)] hover:bg-[var(--sand-soft)] hover:text-[var(--ocean)]"
            }`}
          >
            <Icon aria-hidden className="size-5 shrink-0" />
            <span className="max-w-full whitespace-normal break-words text-center leading-tight px-0.5">{item[lang]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
