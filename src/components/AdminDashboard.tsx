"use client";

import { useRef, useState, useCallback } from "react";
import {
  ChevronDown, ChevronRight, FilePlus, LogOut, Mic2,
  Pencil, PlayCircle, Save, Trash2, Upload, ImageIcon,
} from "lucide-react";
import type { SiteContent, Stop } from "@/types/content";
import { useRouter } from "next/navigation";

// ─── small helpers ────────────────────────────────────────────────────────────

type Lang = "vi" | "en";

function Field({
  label, value, onChange, multiline = false, rows = 3,
}: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; rows?: number;
}) {
  const cls =
    "w-full rounded-xl border border-[var(--line)] bg-[var(--sand-soft)] px-3 py-2 text-sm focus:border-[var(--ocean)] focus:outline-none";
  return (
    <div>
      <label className="mb-1 block text-xs font-black uppercase tracking-wide text-[var(--muted)]">
        {label}
      </label>
      {multiline ? (
        <textarea rows={rows} className={cls} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type="text" className={cls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function BilingualField({
  label, vi, en,
  onVi, onEn, multiline = false, rows = 3,
}: {
  label: string; vi: string; en: string;
  onVi: (v: string) => void; onEn: (v: string) => void;
  multiline?: boolean; rows?: number;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label={`${label} 🇻🇳`} value={vi} onChange={onVi} multiline={multiline} rows={rows} />
      <Field label={`${label} 🇬🇧`} value={en} onChange={onEn} multiline={multiline} rows={rows} />
    </div>
  );
}

// ─── AudioUploader ────────────────────────────────────────────────────────────
function AudioUploader({ stopId, lang, current, onUploaded }: {
  stopId: number; lang: Lang; current: string;
  onUploaded: (path: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  const upload = async (file: File) => {
    setUploading(true);
    setMsg("");
    // Rename to standard pattern
    const ext = file.name.split(".").pop() ?? "m4a";
    const standardName = `stop${stopId}_${lang}.${ext}`;
    const form = new FormData();
    form.append("file", file, standardName);

    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json() as { ok?: boolean; path?: string; message?: string };

    if (res.ok && data.path) {
      onUploaded(data.path);
      setMsg(`✅ Đã upload: ${data.path}`);
    } else {
      setMsg(`❌ ${data.message ?? "Upload thất bại"}`);
    }
    setUploading(false);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  };

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--sand-soft)] p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-[var(--muted)]">
            Audio {lang === "vi" ? "🇻🇳" : "🇬🇧"}
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-[var(--ink)]">{current}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          {current && (
            <a
              href={current}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-9 place-items-center rounded-full bg-[var(--teal-soft)] text-[var(--ocean)]"
              aria-label="Preview audio"
            >
              <PlayCircle className="size-5" />
            </a>
          )}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="grid size-9 place-items-center rounded-full bg-[var(--ocean)] text-white disabled:opacity-50"
            aria-label={`Upload audio ${lang}`}
          >
            {uploading ? <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Upload className="size-4" />}
          </button>
        </div>
      </div>
      {msg && <p className="mt-2 text-xs font-semibold text-[var(--earth)]">{msg}</p>}
      <input ref={inputRef} type="file" accept=".mp3,.m4a,.ogg,.wav,audio/*" className="sr-only" onChange={onFile} />
    </div>
  );
}

// ─── ImageUploader ─────────────────────────────────────────────────────────────
function ImageUploader({ current, onUploaded }: { current: string; onUploaded: (path: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  const upload = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload-image", { method: "POST", body: form });
    const data = await res.json() as { ok?: boolean; path?: string; message?: string };
    if (res.ok && data.path) { onUploaded(data.path); setMsg(`✅ ${data.path}`); }
    else setMsg(`❌ ${data.message ?? "Upload thất bại"}`);
    setUploading(false);
  };

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--sand-soft)] p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-[var(--muted)]">Ảnh minh họa</p>
          <p className="truncate text-sm font-semibold text-[var(--ink)]">{current}</p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="grid size-9 place-items-center rounded-full bg-[var(--earth)] text-white disabled:opacity-50"
          aria-label="Upload image"
        >
          {uploading ? <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <ImageIcon className="size-4" />}
        </button>
      </div>
      {current && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={current} alt="preview" className="mt-2 h-24 w-full rounded-xl object-cover" />
      )}
      {msg && <p className="mt-1 text-xs font-semibold text-[var(--earth)]">{msg}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
    </div>
  );
}

// ─── Stop editor panel ────────────────────────────────────────────────────────
function StopEditor({ stop, onChange, onSave, onDelete, saving }: {
  stop: Stop; onChange: (patch: Partial<Stop>) => void;
  onSave: () => void; onDelete: () => void; saving: boolean;
}) {
  const loc = (field: keyof Stop, lang: Lang) => {
    const val = stop[field] as { vi: string; en: string };
    return val?.[lang] ?? "";
  };

  const setLoc = (field: "title" | "subtitle" | "summary" | "transcript" | "location" | "reflection", lang: Lang, value: string) => {
    onChange({ [field]: { ...(stop[field] as object), [lang]: value } } as Partial<Stop>);
  };

  const setHighlight = (lang: Lang, idx: number, value: string) => {
    const arr = [...(stop.highlights[lang] ?? [])];
    arr[idx] = value;
    onChange({ highlights: { ...stop.highlights, [lang]: arr } });
  };

  const addHighlight = (lang: Lang) => {
    onChange({ highlights: { ...stop.highlights, [lang]: [...(stop.highlights[lang] ?? []), ""] } });
  };

  const removeHighlight = (lang: Lang, idx: number) => {
    const arr = stop.highlights[lang].filter((_, i) => i !== idx);
    onChange({ highlights: { ...stop.highlights, [lang]: arr } });
  };

  return (
    <div className="space-y-6">
      {/* Basic */}
      <section className="rounded-2xl bg-white/88 p-5 shadow">
        <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-[var(--ocean)]">
          📋 Thông tin cơ bản
        </h3>
        <div className="space-y-4">
          <Field label="Thời lượng" value={stop.duration} onChange={(v) => onChange({ duration: v })} />
          <BilingualField label="Tiêu đề" vi={loc("title", "vi")} en={loc("title", "en")} onVi={(v) => setLoc("title", "vi", v)} onEn={(v) => setLoc("title", "en", v)} />
          <BilingualField label="Phụ đề" vi={loc("subtitle", "vi")} en={loc("subtitle", "en")} onVi={(v) => setLoc("subtitle", "vi", v)} onEn={(v) => setLoc("subtitle", "en", v)} />
          <BilingualField label="Tóm tắt" vi={loc("summary", "vi")} en={loc("summary", "en")} onVi={(v) => setLoc("summary", "vi", v)} onEn={(v) => setLoc("summary", "en", v)} multiline rows={3} />
          <BilingualField label="Vị trí" vi={loc("location", "vi")} en={loc("location", "en")} onVi={(v) => setLoc("location", "vi", v)} onEn={(v) => setLoc("location", "en", v)} />
          <BilingualField label="Suy ngẫm" vi={loc("reflection", "vi")} en={loc("reflection", "en")} onVi={(v) => setLoc("reflection", "vi", v)} onEn={(v) => setLoc("reflection", "en", v)} multiline rows={2} />
        </div>
      </section>

      {/* Transcript */}
      <section className="rounded-2xl bg-white/88 p-5 shadow">
        <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-[var(--ocean)]">📜 Transcript audio</h3>
        <div className="space-y-4">
          <BilingualField label="Transcript" vi={loc("transcript", "vi")} en={loc("transcript", "en")} onVi={(v) => setLoc("transcript", "vi", v)} onEn={(v) => setLoc("transcript", "en", v)} multiline rows={8} />
        </div>
      </section>

      {/* Highlights */}
      <section className="rounded-2xl bg-white/88 p-5 shadow">
        <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-[var(--ocean)]">✨ Điểm nổi bật</h3>
        {(["vi", "en"] as Lang[]).map((lang) => (
          <div key={lang} className="mb-4">
            <p className="mb-2 text-xs font-black text-[var(--muted)]">{lang === "vi" ? "🇻🇳 Tiếng Việt" : "🇬🇧 English"}</p>
            {stop.highlights[lang].map((h, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={h}
                  onChange={(e) => setHighlight(lang, i, e.target.value)}
                  className="flex-1 rounded-xl border border-[var(--line)] bg-[var(--sand-soft)] px-3 py-2 text-sm focus:outline-none"
                />
                <button type="button" onClick={() => removeHighlight(lang, i)} className="grid size-9 place-items-center rounded-full bg-red-50 text-red-700" aria-label="Remove">
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addHighlight(lang)} className="mt-1 inline-flex min-h-9 items-center gap-1 rounded-full border border-[var(--line)] px-3 text-xs font-bold">
              + Thêm mục
            </button>
          </div>
        ))}
      </section>

      {/* Audio upload */}
      <section className="rounded-2xl bg-white/88 p-5 shadow">
        <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-[var(--ocean)]">
          <Mic2 className="mr-1 inline size-4" />
          File audio
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <AudioUploader stopId={stop.id} lang="vi" current={stop.audio.vi} onUploaded={(p) => onChange({ audio: { ...stop.audio, vi: p } })} />
          <AudioUploader stopId={stop.id} lang="en" current={stop.audio.en} onUploaded={(p) => onChange({ audio: { ...stop.audio, en: p } })} />
        </div>
      </section>

      {/* Image upload */}
      <section className="rounded-2xl bg-white/88 p-5 shadow">
        <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-[var(--ocean)]">
          <ImageIcon className="mr-1 inline size-4" />
          Ảnh minh họa
        </h3>
        <ImageUploader current={stop.image} onUploaded={(p) => onChange({ image: p })} />
      </section>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--ocean)] px-6 font-black text-white disabled:opacity-50"
        >
          <Save className="size-5" />
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
        <a
          href={`/stops/${stop.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--line)] bg-white px-5 text-sm font-bold"
        >
          Xem trang công khai →
        </a>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex min-h-12 items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 text-sm font-bold text-red-700"
        >
          <Trash2 className="size-4" />
          Xoá điểm dừng
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export function AdminDashboard({ content }: { content: SiteContent }) {
  const router = useRouter();
  const [stops, setStops] = useState<Stop[]>(content.stops);
  const [selectedId, setSelectedId] = useState<number>(stops[0]?.id ?? 1);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [creating, setCreating] = useState(false);

  const selected = stops.find((s) => s.id === selectedId);

  const updateStop = useCallback((patch: Partial<Stop>) => {
    setStops((prev) => prev.map((s) => (s.id === selectedId ? { ...s, ...patch } : s)));
  }, [selectedId]);

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    setSaveMsg("");
    const res = await fetch(`/api/stops/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected),
    });
    if (res.ok) {
      setSaveMsg("✅ Đã lưu thành công");
    } else {
      setSaveMsg("❌ Lưu thất bại");
    }
    setSaving(false);
  };

  const deleteStop = async () => {
    if (!selected) return;
    if (!confirm(`Xoá điểm "${selected.title.vi}"? Thao tác không thể hoàn tác.`)) return;
    const res = await fetch(`/api/stops/${selected.id}`, { method: "DELETE" });
    if (res.ok) {
      const remaining = stops.filter((s) => s.id !== selected.id);
      setStops(remaining);
      setSelectedId(remaining[0]?.id ?? 0);
    }
  };

  const createStop = async () => {
    setCreating(true);
    const res = await fetch("/api/stops", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    if (res.ok) {
      const newStop = await res.json() as Stop;
      setStops((prev) => [...prev, newStop]);
      setSelectedId(newStop.id);
    }
    setCreating(false);
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen">
      {/* Admin header */}
      <div className="sticky top-16 z-30 border-b border-[var(--line)] bg-[var(--shell)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[var(--ocean)]">Admin CMS</p>
            <h2 className="text-lg font-black text-[var(--ink)]">Quản lý nội dung Địa đạo Kỳ Anh</h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={createStop}
              disabled={creating}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--bamboo)] px-4 text-sm font-bold text-white disabled:opacity-50"
            >
              <FilePlus className="size-4" />
              {creating ? "Đang tạo..." : "Thêm điểm mới"}
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--line)] px-4 text-sm font-bold text-[var(--muted)]"
            >
              <LogOut className="size-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[280px_1fr] lg:px-8">
        {/* Stop list sidebar */}
        <aside className="mb-6 lg:mb-0">
          <div className="rounded-2xl border border-[var(--line)] bg-white/88 p-2 shadow-lg">
            <p className="px-3 pb-2 pt-1 text-xs font-black uppercase tracking-widest text-[var(--muted)]">Danh sách điểm dừng</p>
            {stops.sort((a, b) => a.id - b.id).map((stop) => (
              <button
                key={stop.id}
                type="button"
                onClick={() => setSelectedId(stop.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${selectedId === stop.id ? "bg-[var(--ocean)] text-white" : "hover:bg-[var(--sand-soft)]"}`}
              >
                <span className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-black ${selectedId === stop.id ? "bg-white/20" : "bg-[var(--sand-soft)] text-[var(--ocean)]"}`}>
                  {stop.id}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{stop.title.vi}</span>
                  <span className={`block truncate text-xs ${selectedId === stop.id ? "text-white/70" : "text-[var(--muted)]"}`}>{stop.duration}</span>
                </span>
                {selectedId === stop.id ? <ChevronRight className="size-4 shrink-0" /> : null}
              </button>
            ))}
          </div>
        </aside>

        {/* Editor */}
        <main>
          {saveMsg && (
            <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-bold ${saveMsg.startsWith("✅") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}>
              {saveMsg}
            </div>
          )}
          {selected ? (
            <>
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-2xl bg-[var(--ocean)] text-lg font-black text-white">
                  {selected.id}
                </span>
                <div>
                  <h2 className="text-xl font-black text-[var(--ink)]">{selected.title.vi}</h2>
                  <p className="text-sm text-[var(--muted)]">{selected.title.en}</p>
                </div>
                <Pencil className="ml-auto size-5 text-[var(--muted)]" />
              </div>
              <StopEditor
                stop={selected}
                onChange={updateStop}
                onSave={save}
                onDelete={deleteStop}
                saving={saving}
              />
            </>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-[var(--line)] p-12 text-center text-[var(--muted)]">
              Chưa có điểm dừng nào. Bấm &quot;Thêm điểm mới&quot; để bắt đầu.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
