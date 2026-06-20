"use client";

import { Languages } from "lucide-react";
import type { Lang } from "@/types/content";
import { usePreferences } from "./PreferenceProvider";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = usePreferences();

  const labels: Record<Lang, string> = {
    vi: "Tiếng Việt",
    en: "English",
  };

  return (
    <div
      className="inline-flex min-h-11 items-center gap-1 rounded-full border border-[var(--line)] bg-white/80 p-1 shadow-sm backdrop-blur tunnel:bg-stone-950/70"
      role="group"
      aria-label="Language selector"
    >
      {!compact && <Languages aria-hidden className="ml-2 size-4 text-[var(--muted)]" />}
      {(["vi", "en"] as Lang[]).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={lang === option}
          aria-label={`Switch language to ${labels[option]}`}
          onClick={() => setLang(option)}
          className={`min-h-9 rounded-full px-3 text-sm font-semibold transition ${
            lang === option
              ? "bg-[var(--ocean)] text-white shadow"
              : "text-[var(--ink)] hover:bg-[var(--sand-soft)]"
          }`}
        >
          {option === "vi" ? "VI" : "EN"}
        </button>
      ))}
    </div>
  );
}
