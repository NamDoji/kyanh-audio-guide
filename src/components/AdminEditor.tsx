"use client";

import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import type { SiteContent, Stop } from "@/types/content";

export function AdminEditor({ content }: { content: SiteContent }) {
  const [stops, setStops] = useState(content.stops);
  const [selectedId, setSelectedId] = useState(content.stops[0]?.id ?? 1);
  const [status, setStatus] = useState("");

  const selected = useMemo(
    () => stops.find((stop) => stop.id === selectedId) ?? stops[0],
    [selectedId, stops],
  );

  const updateSelected = (patch: Partial<Stop>) => {
    setStops((current) =>
      current.map((stop) => (stop.id === selected.id ? { ...stop, ...patch } : stop)),
    );
  };

  const updateLocalized = (
    field: "title" | "subtitle" | "summary" | "transcript" | "location" | "reflection",
    lang: "vi" | "en",
    value: string,
  ) => {
    updateSelected({
      [field]: {
        ...selected[field],
        [lang]: value,
      },
    } as Partial<Stop>);
  };

  const updateAudio = (lang: "vi" | "en", value: string) => {
    updateSelected({ audio: { ...selected.audio, [lang]: value } });
  };

  const save = async () => {
    setStatus("Saving...");
    const response = await fetch(`/api/stops/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected),
    });
    setStatus(response.ok ? "Saved. Refresh public pages to see the latest content." : "Save failed.");
  };

  if (!selected) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--ocean)]">Admin CMS</p>
        <h1 className="heritage-title mt-3 text-4xl font-black text-[var(--ink)] sm:text-5xl">
          Quản lý nội dung điểm dừng
        </h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
          MVP backend lưu nội dung vào <code>data/stops.json</code>. Dùng form này để chỉnh tiêu đề, tóm tắt, transcript, audio path và ảnh.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[2rem] border border-[var(--line)] bg-white/88 p-3 shadow-lg tunnel:bg-stone-950/80">
          {stops.map((stop) => (
            <button
              key={stop.id}
              type="button"
              onClick={() => setSelectedId(stop.id)}
              className={`mb-2 flex min-h-14 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-black ${
                selectedId === stop.id ? "bg-[var(--ocean)] text-white" : "hover:bg-[var(--sand-soft)]"
              }`}
            >
              <span>Stop {stop.id}</span>
              <span className="line-clamp-1">{stop.title.vi}</span>
            </button>
          ))}
        </aside>

        <div className="rounded-[2rem] border border-[var(--line)] bg-white/90 p-5 shadow-xl tunnel:bg-stone-950/80">
          <div className="grid gap-4 md:grid-cols-2">
            {(["vi", "en"] as const).map((lang) => (
              <div key={lang} className="space-y-4">
                <h2 className="text-xl font-black text-[var(--ink)]">{lang === "vi" ? "Tiếng Việt" : "English"}</h2>
                <label className="block">
                  <span className="text-sm font-bold">Title</span>
                  <input
                    value={selected.title[lang]}
                    onChange={(event) => updateLocalized("title", lang, event.target.value)}
                    className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-slate-900"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold">Subtitle</span>
                  <input
                    value={selected.subtitle[lang]}
                    onChange={(event) => updateLocalized("subtitle", lang, event.target.value)}
                    className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-slate-900"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold">Summary</span>
                  <textarea
                    value={selected.summary[lang]}
                    onChange={(event) => updateLocalized("summary", lang, event.target.value)}
                    rows={5}
                    className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-slate-900"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold">Transcript</span>
                  <textarea
                    value={selected.transcript[lang]}
                    onChange={(event) => updateLocalized("transcript", lang, event.target.value)}
                    rows={8}
                    className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-slate-900"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold">Audio path</span>
                  <input
                    value={selected.audio[lang]}
                    onChange={(event) => updateAudio(lang, event.target.value)}
                    className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-slate-900"
                  />
                </label>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold">Image path</span>
              <input
                value={selected.image}
                onChange={(event) => updateSelected({ image: event.target.value })}
                className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-slate-900"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold">Duration</span>
              <input
                value={selected.duration}
                onChange={(event) => updateSelected({ duration: event.target.value })}
                className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-slate-900"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={save}
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--ocean)] px-6 font-black text-white shadow-lg"
          >
            <Save aria-hidden className="size-5" />
            Save stop {selected.id}
          </button>
          {status && <p className="mt-4 rounded-2xl bg-[var(--sand-soft)] p-3 text-sm font-bold text-[var(--earth)]">{status}</p>}
        </div>
      </div>
    </section>
  );
}
