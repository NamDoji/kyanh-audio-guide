"use client";

import { Type } from "lucide-react";
import { usePreferences } from "./PreferenceProvider";

export function FontSizeControl() {
  const { decreaseFont, increaseFont, fontScale } = usePreferences();

  return (
    <div
      className="inline-flex min-h-11 items-center gap-1 rounded-full border border-[var(--line)] bg-white/80 p-1 shadow-sm tunnel:bg-stone-950/70"
      aria-label="Font size controls"
    >
      <Type aria-hidden className="ml-2 size-4 text-[var(--muted)]" />
      <button
        type="button"
        onClick={decreaseFont}
        aria-label="Decrease text size"
        className="min-h-9 min-w-9 rounded-full text-sm font-bold hover:bg-[var(--sand-soft)]"
      >
        A-
      </button>
      <span className="sr-only">Current text scale {fontScale}</span>
      <button
        type="button"
        onClick={increaseFont}
        aria-label="Increase text size"
        className="min-h-9 min-w-9 rounded-full text-sm font-bold hover:bg-[var(--sand-soft)]"
      >
        A+
      </button>
    </div>
  );
}
