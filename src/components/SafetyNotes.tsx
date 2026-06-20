"use client";

import { Ear, Footprints, Hand, Volume2 } from "lucide-react";
import { usePreferences } from "./PreferenceProvider";

const notes = [
  {
    icon: Footprints,
    vi: "Đi theo lối chỉ dẫn",
    en: "Follow the marked route",
  },
  {
    icon: Ear,
    vi: "Giữ trật tự khi nghe",
    en: "Keep quiet while listening",
  },
  {
    icon: Hand,
    vi: "Không chạm hiện vật",
    en: "Do not touch artefacts",
  },
  {
    icon: Volume2,
    vi: "Dùng tai nghe âm lượng vừa phải",
    en: "Use moderate headphone volume",
  },
];

export function SafetyNotes() {
  const { lang } = usePreferences();

  return (
    <section className="rounded-[2rem] border border-[var(--line)] bg-white/86 p-5 shadow-sm tunnel:bg-stone-950/80">
      <h2 className="text-xl font-black text-[var(--ink)]">
        {lang === "vi" ? "Lưu ý an toàn" : "Safety notes"}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {notes.map((note) => {
          const Icon = note.icon;
          return (
            <div key={note.en} className="rounded-3xl bg-[var(--sand-soft)] p-4">
              <Icon aria-hidden className="size-6 text-[var(--earth)]" />
              <p className="mt-3 text-sm font-bold leading-6 text-[var(--ink)]">{note[lang]}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
