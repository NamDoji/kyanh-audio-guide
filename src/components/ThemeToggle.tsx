"use client";

import { Moon, Sun } from "lucide-react";
import { usePreferences } from "./PreferenceProvider";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { tunnelMode, setTunnelMode } = usePreferences();

  return (
    <button
      type="button"
      onClick={() => setTunnelMode(!tunnelMode)}
      aria-label={tunnelMode ? "Switch to daylight theme" : "Switch to tunnel mode"}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white/80 text-sm font-semibold text-[var(--ink)] shadow-sm transition hover:bg-[var(--sand-soft)] tunnel:bg-stone-950/70 ${compact ? "min-w-11 px-0" : "px-3"}`}
    >
      {tunnelMode ? <Sun aria-hidden className="size-4" /> : <Moon aria-hidden className="size-4" />}
      {!compact ? <span className="hidden sm:inline">{tunnelMode ? "Day" : "Tunnel"}</span> : null}
    </button>
  );
}
