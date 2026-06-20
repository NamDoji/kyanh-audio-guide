"use client";

import Link from "next/link";
import { Home, Map, MessageSquare, QrCode, Route } from "lucide-react";
import { usePreferences } from "./PreferenceProvider";

const items = [
  { href: "/", icon: Home, vi: "Home", en: "Home" },
  { href: "/stops", icon: Route, vi: "Điểm", en: "Stops" },
  { href: "/map", icon: Map, vi: "Map", en: "Map" },
  { href: "/qr", icon: QrCode, vi: "QR", en: "QR" },
  { href: "/feedback", icon: MessageSquare, vi: "Góp ý", en: "Feedback" },
];

export function BottomNav() {
  const { lang } = usePreferences();

  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 rounded-[1.5rem] border border-white/50 bg-white/92 p-1 shadow-2xl backdrop-blur-xl tunnel:border-stone-700 tunnel:bg-stone-950/92 md:hidden"
      aria-label="Mobile bottom navigation"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-bold text-[var(--muted)] transition hover:bg-[var(--sand-soft)] hover:text-[var(--ocean)]"
          >
            <Icon aria-hidden className="size-5" />
            <span>{item[lang]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
