"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import {
  BarChart3,
  ChevronRight,
  FilePlus,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Mic2,
  Newspaper,
  Pencil,
  PlayCircle,
  QrCode,
  Save,
  Settings,
  Trash2,
  Upload,
} from "lucide-react";
import type { FeedbackRecord, NewsPost, SiteContent, Stop } from "@/types/content";

type Lang = "vi" | "en";
type AdminTab = "stops" | "news" | "feedback" | "qr" | "stats" | "site";

type StatsPayload = {
  totalVisits: number;
  todayVisits: number;
  totalFeedback: number;
  averageRating: number;
  topPaths: { path: string; count: number }[];
  stopVisits: { stopId: number; count: number }[];
  dailyVisits: { date: string; count: number }[];
  latestFeedback: FeedbackRecord[];
};

function Field({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  type?: string;
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
        <input type={type} className={cls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function BilingualField({
  label,
  vi,
  en,
  onVi,
  onEn,
  multiline = false,
  rows = 3,
}: {
  label: string;
  vi: string;
  en: string;
  onVi: (v: string) => void;
  onEn: (v: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label={`${label} VI`} value={vi} onChange={onVi} multiline={multiline} rows={rows} />
      <Field label={`${label} EN`} value={en} onChange={onEn} multiline={multiline} rows={rows} />
    </div>
  );
}

function AudioUploader({
  stopId,
  lang,
  current,
  onUploaded,
}: {
  stopId: number;
  lang: Lang;
  current: string;
  onUploaded: (stop: Stop) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const doUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);
    setMsg(null);

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "m4a";
    const pathname = `audio/stop${stopId}_${lang}_${Date.now()}.${ext}`;

    try {
      // 1. Lấy client token từ server (xác thực admin, không gửi file)
      const tokenRes = await fetch(`/api/admin/upload?pathname=${encodeURIComponent(pathname)}`);
      if (!tokenRes.ok) {
        const err = (await tokenRes.json()) as { message?: string };
        throw new Error(err.message ?? `Lỗi lấy token (${tokenRes.status})`);
      }
      const { token } = (await tokenRes.json()) as { token: string };
      setProgress(15);

      // 2. Upload thẳng browser → Vercel Blob CDN (không qua serverless, không bị giới hạn 4.5 MB)
      const { put: blobPut } = await import("@vercel/blob/client");
      const blob = await blobPut(pathname, file, {
        access: "public",
        token,
        contentType: file.type || `audio/${ext}`,
        onUploadProgress: ({ percentage }) =>
          setProgress(15 + Math.round(percentage * 0.75)),
      });
      setProgress(90);

      // 3. Lưu URL vào stop
      const saveRes = await fetch("/api/admin/audio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stopId, lang, url: blob.url }),
      });
      const saveData = (await saveRes.json()) as { ok?: boolean; stop?: Stop; message?: string };

      if (saveRes.ok && saveData.stop) {
        onUploaded(saveData.stop);
        setMsg({ text: "Upload thành công!", ok: true });
      } else {
        throw new Error(saveData.message ?? "Lỗi lưu đường dẫn");
      }
    } catch (clientErr) {
      // Fallback: FormData (local dev không có Blob token)
      try {
        const form = new FormData();
        form.append("file", file);
        form.append("stopId", String(stopId));
        form.append("lang", lang);
        const res = await fetch("/api/admin/upload", { method: "POST", body: form });
        const data = (await res.json()) as { ok?: boolean; stop?: Stop; message?: string };
        if (res.ok && data.stop) {
          onUploaded(data.stop);
          setMsg({ text: "Upload thành công! (fallback)", ok: true });
        } else {
          // Hiển thị lỗi gốc (client upload) và lỗi fallback
          const origErr = (clientErr as Error).message;
          setMsg({ text: `${origErr || "Client upload lỗi"} — ${data.message ?? "Fallback cũng thất bại"}`, ok: false });
        }
      } catch (fallbackErr) {
        const origErr = (clientErr as Error).message;
        setMsg({ text: origErr || (fallbackErr as Error).message || "Upload thất bại", ok: false });
      }
    }

    setProgress(100);
    setUploading(false);
  };

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--sand-soft)] p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-[var(--muted)]">Audio {lang.toUpperCase()}</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-[var(--ink)]">{current || "Chưa có file"}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          {current ? (
            <a
              href={current}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-9 place-items-center rounded-full bg-[var(--teal-soft)] text-[var(--ocean)]"
              aria-label="Preview audio"
            >
              <PlayCircle className="size-5" />
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="grid size-9 place-items-center rounded-full bg-[var(--ocean)] text-white disabled:opacity-50"
            aria-label={`Upload audio ${lang}`}
          >
            {uploading
              ? <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              : <Upload className="size-4" />}
          </button>
        </div>
      </div>
      {uploading && progress > 0 && progress < 100 ? (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--line)]">
          <div
            className="h-full rounded-full bg-[var(--ocean)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}
      {msg ? (
        <p className={`mt-2 text-xs font-semibold ${msg.ok ? "text-green-700" : "text-red-700"}`}>
          {msg.text}
        </p>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept=".mp3,.m4a,.ogg,.wav,audio/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) doUpload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function ImageUploader({ stopId, current, onUploaded }: { stopId: number; current: string; onUploaded: (stop: Stop) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  const upload = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("stopId", String(stopId));
    const res = await fetch("/api/admin/upload-image", { method: "POST", body: form });
    const data = (await res.json()) as { ok?: boolean; path?: string; stop?: Stop; message?: string };
    if (res.ok && data.path && data.stop) {
      onUploaded(data.stop);
      setMsg(`Da upload va luu: ${data.path}`);
    } else {
      setMsg(data.message ?? "Upload that bai");
    }
    setUploading(false);
  };

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--sand-soft)] p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-[var(--muted)]">Anh minh hoa</p>
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
      {current ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={current} alt="preview" className="mt-2 h-24 w-full rounded-xl object-cover" />
      ) : null}
      {msg ? <p className="mt-1 text-xs font-semibold text-[var(--earth)]">{msg}</p> : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function StopEditor({
  stop,
  onChange,
  onSave,
  onDelete,
  saving,
}: {
  stop: Stop;
  onChange: (patch: Partial<Stop>) => void;
  onSave: () => void;
  onDelete: () => void;
  saving: boolean;
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

  const setMapPosition = (axis: "x" | "y", value: string) => {
    const numeric = Math.max(0, Math.min(100, Number(value) || 0));
    onChange({ mapPosition: { ...stop.mapPosition, [axis]: numeric } });
  };

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    onChange({ mapPosition: { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) } });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white/88 p-5 shadow">
        <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-[var(--ocean)]">Thong tin diem dung</h3>
        <div className="space-y-4">
          <Field label="Slug" value={stop.slug} onChange={(v) => onChange({ slug: v })} />
          <Field label="Thoi luong" value={stop.duration} onChange={(v) => onChange({ duration: v })} />
          <BilingualField label="Tieu de" vi={loc("title", "vi")} en={loc("title", "en")} onVi={(v) => setLoc("title", "vi", v)} onEn={(v) => setLoc("title", "en", v)} />
          <BilingualField label="Phu de" vi={loc("subtitle", "vi")} en={loc("subtitle", "en")} onVi={(v) => setLoc("subtitle", "vi", v)} onEn={(v) => setLoc("subtitle", "en", v)} />
          <BilingualField label="Tom tat" vi={loc("summary", "vi")} en={loc("summary", "en")} onVi={(v) => setLoc("summary", "vi", v)} onEn={(v) => setLoc("summary", "en", v)} multiline />
          <BilingualField label="Vi tri" vi={loc("location", "vi")} en={loc("location", "en")} onVi={(v) => setLoc("location", "vi", v)} onEn={(v) => setLoc("location", "en", v)} />
          <BilingualField label="Suy ngam" vi={loc("reflection", "vi")} en={loc("reflection", "en")} onVi={(v) => setLoc("reflection", "vi", v)} onEn={(v) => setLoc("reflection", "en", v)} multiline rows={2} />
        </div>
      </section>

      <section className="rounded-2xl bg-white/88 p-5 shadow">
        <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-[var(--ocean)]">Transcript audio</h3>
        <BilingualField label="Transcript" vi={loc("transcript", "vi")} en={loc("transcript", "en")} onVi={(v) => setLoc("transcript", "vi", v)} onEn={(v) => setLoc("transcript", "en", v)} multiline rows={8} />
      </section>

      <section className="rounded-2xl bg-white/88 p-5 shadow">
        <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-[var(--ocean)]">Diem noi bat</h3>
        {(["vi", "en"] as Lang[]).map((lang) => (
          <div key={lang} className="mb-4">
            <p className="mb-2 text-xs font-black text-[var(--muted)]">{lang.toUpperCase()}</p>
            {stop.highlights[lang].map((h, i) => (
              <div key={`${lang}-${i}`} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={h}
                  onChange={(e) => setHighlight(lang, i, e.target.value)}
                  className="flex-1 rounded-xl border border-[var(--line)] bg-[var(--sand-soft)] px-3 py-2 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => onChange({ highlights: { ...stop.highlights, [lang]: stop.highlights[lang].filter((_, index) => index !== i) } })}
                  className="grid size-9 place-items-center rounded-full bg-red-50 text-red-700"
                  aria-label="Remove highlight"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange({ highlights: { ...stop.highlights, [lang]: [...(stop.highlights[lang] ?? []), ""] } })}
              className="mt-1 inline-flex min-h-9 items-center rounded-full border border-[var(--line)] px-3 text-xs font-bold"
            >
              Them muc
            </button>
          </div>
        ))}
      </section>

      <section className="rounded-2xl bg-white/88 p-5 shadow">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[var(--ocean)]">
          <Mic2 className="size-4" />
          File audio
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <AudioUploader stopId={stop.id} lang="vi" current={stop.audio.vi} onUploaded={(updated) => onChange({ audio: updated.audio })} />
          <AudioUploader stopId={stop.id} lang="en" current={stop.audio.en} onUploaded={(updated) => onChange({ audio: updated.audio })} />
        </div>
      </section>

      <section className="rounded-2xl bg-white/88 p-5 shadow">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[var(--ocean)]">
          <ImageIcon className="size-4" />
          Ảnh và vị trí bản đồ
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <ImageUploader stopId={stop.id} current={stop.image} onUploaded={(updated) => onChange({ image: updated.image })} />
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-wide text-[var(--muted)]">
              Vị trí trên bản đồ — click để chọn
            </p>
            {/* Visual map picker */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#dff6f1] via-[#f7e7b0] to-[#7b4d31]">
              <svg
                viewBox="0 0 100 100"
                className="w-full cursor-crosshair"
                style={{ height: 180 }}
                onClick={handleMapClick}
                role="button"
                aria-label="Click để đặt vị trí trên bản đồ"
              >
                {/* Route path */}
                <path
                  d="M10 80 C23 70 26 63 38 57 C51 50 51 42 64 36 C73 31 80 24 90 17"
                  fill="none"
                  stroke="rgba(23,32,51,.5)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                {/* Water */}
                <path d="M0 83 C14 79 27 89 42 82 C56 75 67 82 100 74 L100 100 L0 100 Z" fill="rgba(0,108,128,.22)" />
                {/* Current pin */}
                <circle
                  cx={stop.mapPosition.x}
                  cy={stop.mapPosition.y}
                  r="5"
                  fill="var(--ocean, #006C80)"
                  stroke="white"
                  strokeWidth="1.5"
                />
                <text
                  x={stop.mapPosition.x}
                  y={stop.mapPosition.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="4"
                  fontWeight="bold"
                >
                  {stop.id}
                </text>
              </svg>
            </div>
            {/* Manual number inputs as fallback */}
            <div className="grid grid-cols-2 gap-2">
              <Field label="X (%)" value={String(stop.mapPosition.x)} onChange={(v) => setMapPosition("x", v)} />
              <Field label="Y (%)" value={String(stop.mapPosition.y)} onChange={(v) => setMapPosition("y", v)} />
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onSave} disabled={saving} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--ocean)] px-6 font-black text-white disabled:opacity-50">
          <Save className="size-5" />
          {saving ? "Dang luu..." : "Luu thay doi"}
        </button>
        <Link href={`/stops/${stop.id}`} target="_blank" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--line)] bg-white px-5 text-sm font-bold">
          Xem public
        </Link>
        <button type="button" onClick={onDelete} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 text-sm font-bold text-red-700">
          <Trash2 className="size-4" />
          Xoa diem dung
        </button>
      </div>
    </div>
  );
}

function NewsEditor({
  posts,
  selectedId,
  setSelectedId,
  setPosts,
}: {
  posts: NewsPost[];
  selectedId: number;
  setSelectedId: (id: number) => void;
  setPosts: React.Dispatch<React.SetStateAction<NewsPost[]>>;
}) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const selected = posts.find((post) => post.id === selectedId) ?? posts[0];

  const updatePost = (patch: Partial<NewsPost>) => {
    if (!selected) return;
    setPosts((prev) => prev.map((post) => (post.id === selected.id ? { ...post, ...patch } : post)));
  };

  const setLoc = (field: "title" | "excerpt" | "body", lang: Lang, value: string) => {
    if (!selected) return;
    updatePost({ [field]: { ...selected[field], [lang]: value } } as Partial<NewsPost>);
  };

  const createPost = async () => {
    const res = await fetch("/api/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (res.ok) {
      const post = (await res.json()) as NewsPost;
      setPosts((prev) => [post, ...prev]);
      setSelectedId(post.id);
    }
  };

  const savePost = async () => {
    if (!selected) return;
    setSaving(true);
    setMsg("");
    const res = await fetch(`/api/admin/news/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected),
    });
    if (res.ok) {
      const post = (await res.json()) as NewsPost;
      setPosts((prev) => prev.map((item) => (item.id === post.id ? post : item)));
      setMsg("Da luu tin tuc");
    } else {
      setMsg("Luu tin tuc that bai");
    }
    setSaving(false);
  };

  const deletePost = async () => {
    if (!selected || !confirm(`Xoa tin "${selected.title.vi}"?`)) return;
    const res = await fetch(`/api/admin/news/${selected.id}`, { method: "DELETE" });
    if (res.ok) {
      const remaining = posts.filter((post) => post.id !== selected.id);
      setPosts(remaining);
      setSelectedId(remaining[0]?.id ?? 0);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-2xl border border-[var(--line)] bg-white/88 p-2 shadow-lg">
        <button type="button" onClick={createPost} className="mb-2 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[var(--bamboo)] px-3 text-sm font-bold text-white">
          <FilePlus className="size-4" />
          Them tin tuc
        </button>
        {posts.map((post) => (
          <button
            key={post.id}
            type="button"
            onClick={() => setSelectedId(post.id)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${selected?.id === post.id ? "bg-[var(--ocean)] text-white" : "hover:bg-[var(--sand-soft)]"}`}
          >
            <Newspaper className="size-4 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">{post.title.vi}</span>
              <span className={`block text-xs ${selected?.id === post.id ? "text-white/70" : "text-[var(--muted)]"}`}>{post.status}</span>
            </span>
          </button>
        ))}
      </aside>

      <main>
        {msg ? <div className="mb-4 rounded-2xl bg-green-50 px-4 py-3 text-sm font-bold text-green-800">{msg}</div> : null}
        {selected ? (
          <div className="space-y-6">
            <section className="rounded-2xl bg-white/88 p-5 shadow">
              <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-[var(--ocean)]">Noi dung tin tuc</h3>
              <div className="space-y-4">
                <Field label="Slug" value={selected.slug} onChange={(v) => updatePost({ slug: v })} />
                <Field label="Ngay xuat ban" type="datetime-local" value={selected.publishedAt.slice(0, 16)} onChange={(v) => updatePost({ publishedAt: new Date(v).toISOString() })} />
                <label className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--sand-soft)] px-3 py-2 text-sm font-bold">
                  <input type="checkbox" checked={selected.status === "published"} onChange={(e) => updatePost({ status: e.target.checked ? "published" : "draft" })} />
                  Xuat ban tin nay
                </label>
                <Field label="Anh dai dien" value={selected.image} onChange={(v) => updatePost({ image: v })} />
                <BilingualField label="Tieu de" vi={selected.title.vi} en={selected.title.en} onVi={(v) => setLoc("title", "vi", v)} onEn={(v) => setLoc("title", "en", v)} />
                <BilingualField label="Mo ta ngan" vi={selected.excerpt.vi} en={selected.excerpt.en} onVi={(v) => setLoc("excerpt", "vi", v)} onEn={(v) => setLoc("excerpt", "en", v)} multiline />
                <BilingualField label="Noi dung" vi={selected.body.vi} en={selected.body.en} onVi={(v) => setLoc("body", "vi", v)} onEn={(v) => setLoc("body", "en", v)} multiline rows={10} />
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={savePost} disabled={saving} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--ocean)] px-6 font-black text-white disabled:opacity-50">
                <Save className="size-5" />
                {saving ? "Dang luu..." : "Luu tin tuc"}
              </button>
              {selected.status === "published" ? (
                <Link href={`/news/${selected.id}`} target="_blank" className="inline-flex min-h-12 items-center rounded-full border border-[var(--line)] bg-white px-5 text-sm font-bold">
                  Xem public
                </Link>
              ) : null}
              <button type="button" onClick={deletePost} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 text-sm font-bold text-red-700">
                <Trash2 className="size-4" />
                Xoa tin
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-[var(--line)] p-12 text-center text-[var(--muted)]">
            Chua co tin tuc. Bam &quot;Them tin tuc&quot; de tao moi.
          </div>
        )}
      </main>
    </div>
  );
}

function QRDownloadCard({ stop, baseUrl }: { stop: Stop; baseUrl: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const url = `${baseUrl.replace(/\/$/, "")}${stop.qrPath}`;

  const download = () => {
    const canvas = wrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    const anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = `ky-anh-stop-${stop.id}-qr.png`;
    anchor.click();
  };

  return (
    <article className="rounded-2xl border border-[var(--line)] bg-white/90 p-5 shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-[var(--ocean)]">Stop {stop.id}</p>
          <h3 className="mt-2 text-lg font-black text-[var(--ink)]">{stop.title.vi}</h3>
        </div>
        <button type="button" onClick={download} className="grid size-10 place-items-center rounded-full bg-[var(--ocean)] text-white" aria-label="Download QR">
          <Upload className="size-4" />
        </button>
      </div>
      <div ref={wrapRef} className="mt-4 grid place-items-center rounded-2xl bg-white p-4">
        <QRCodeCanvas value={url} size={180} includeMargin level="H" />
      </div>
      <Link href={stop.qrPath} target="_blank" className="mt-4 block truncate rounded-xl bg-[var(--teal-soft)] px-3 py-2 text-sm font-bold text-[var(--ocean)]">
        {url}
      </Link>
    </article>
  );
}

function QRManager({ stops }: { stops: Stop[] }) {
  const baseUrl = typeof window === "undefined" ? "http://localhost:3000" : window.location.origin;

  return (
    <div>
      <div className="mb-5 rounded-2xl bg-white/88 p-5 shadow">
        <h3 className="text-lg font-black text-[var(--ink)]">Quan ly QR code</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Moi diem dung moi se tu co duong dan QR theo mau /stops/id. Tai PNG de in bien QR ngoai thuc dia.
        </p>
        <Link href="/qr" target="_blank" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[var(--earth)] px-5 text-sm font-black text-white">
          Mo trang QR public
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {stops.map((stop) => (
          <QRDownloadCard key={stop.id} stop={stop} baseUrl={baseUrl} />
        ))}
      </div>
    </div>
  );
}

function StatsPanel({ stops }: { stops: Stop[] }) {
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data as StatsPayload))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="rounded-2xl bg-white/88 p-8 text-center font-bold text-[var(--muted)]">Dang tai thong ke...</div>;
  if (!stats) return <div className="rounded-2xl bg-red-50 p-8 text-center font-bold text-red-700">Khong tai duoc thong ke</div>;

  const stopTitle = (id: number) => stops.find((stop) => stop.id === id)?.title.vi ?? `Stop ${id}`;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Tong truy cap", stats.totalVisits],
          ["Hom nay", stats.todayVisits],
          ["Phan hoi", stats.totalFeedback],
          ["Danh gia TB", stats.averageRating],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white/88 p-5 shadow">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">{label}</p>
            <p className="mt-2 text-3xl font-black text-[var(--ocean)]">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white/88 p-5 shadow">
          <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-[var(--ocean)]">Trang duoc xem nhieu</h3>
          <div className="space-y-3">
            {stats.topPaths.map((item) => (
              <div key={item.path} className="flex items-center justify-between gap-3 rounded-xl bg-[var(--sand-soft)] px-3 py-2">
                <span className="truncate text-sm font-bold">{item.path}</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[var(--ocean)]">{item.count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white/88 p-5 shadow">
          <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-[var(--ocean)]">Luot nghe/xem theo diem</h3>
          <div className="space-y-3">
            {stats.stopVisits.map((item) => (
              <div key={item.stopId} className="flex items-center justify-between gap-3 rounded-xl bg-[var(--sand-soft)] px-3 py-2">
                <span className="truncate text-sm font-bold">{stopTitle(item.stopId)}</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[var(--ocean)]">{item.count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl bg-white/88 p-5 shadow">
        <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-[var(--ocean)]">Phan hoi moi nhat</h3>
        <div className="grid gap-3">
          {stats.latestFeedback.map((item) => (
            <div key={`${item.createdAt}-${item.name}`} className="rounded-xl bg-[var(--sand-soft)] p-4">
              <div className="flex flex-wrap items-center gap-2 text-sm font-black text-[var(--ink)]">
                <span>{item.name}</span>
                <span className="rounded-full bg-white px-2 py-1 text-xs text-[var(--ocean)]">{item.rating}/5</span>
                <span className="text-xs text-[var(--muted)]">{new Date(item.createdAt).toLocaleString("vi-VN")}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.message}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FeedbackManager() {
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const loadFeedback = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/feedback");
    if (res.ok) {
      setFeedback((await res.json()) as FeedbackRecord[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/feedback")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (active) setFeedback(data as FeedbackRecord[]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const remove = async (item: FeedbackRecord) => {
    if (!confirm(`Xoa phan hoi cua "${item.name}"?`)) return;
    const res = await fetch(`/api/admin/feedback/${encodeURIComponent(item.id)}`, { method: "DELETE" });
    if (res.ok) {
      setFeedback((prev) => prev.filter((record) => record.id !== item.id));
      setMsg("Da xoa phan hoi");
    } else {
      setMsg("Xoa phan hoi that bai");
    }
  };

  const averageRating = feedback.length
    ? Number((feedback.reduce((sum, item) => sum + Number(item.rating || 0), 0) / feedback.length).toFixed(1))
    : 0;

  if (loading) return <div className="rounded-2xl bg-white/88 p-8 text-center font-bold text-[var(--muted)]">Dang tai phan hoi...</div>;

  return (
    <div className="space-y-5">
      {msg ? <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-bold text-green-800">{msg}</div> : null}

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Tong phan hoi", feedback.length],
          ["Danh gia TB", averageRating],
          ["Moi nhat", feedback[0] ? new Date(feedback[0].createdAt).toLocaleDateString("vi-VN") : "-"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white/88 p-5 shadow">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">{label}</p>
            <p className="mt-2 text-3xl font-black text-[var(--ocean)]">{value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl bg-white/88 p-5 shadow">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--ocean)]">Quan ly phan hoi</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">Xem danh gia, thong tin lien he va xoa phan hoi spam/test.</p>
          </div>
          <button type="button" onClick={() => loadFeedback()} className="min-h-10 rounded-full border border-[var(--line)] px-4 text-sm font-black text-[var(--muted)]">
            Tai lai
          </button>
        </div>

        {feedback.length ? (
          <div className="grid gap-3">
            {feedback.map((item) => (
              <article key={item.id} className="rounded-xl bg-[var(--sand-soft)] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-sm font-black text-[var(--ink)]">
                      <span>{item.name}</span>
                      <span className="rounded-full bg-white px-2 py-1 text-xs text-[var(--ocean)]">{item.rating}/5</span>
                      <span className="text-xs text-[var(--muted)]">{new Date(item.createdAt).toLocaleString("vi-VN")}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
                      {item.contact ? <span className="rounded-full bg-white px-2 py-1">Lien he: {item.contact}</span> : null}
                      {item.nationality ? <span className="rounded-full bg-white px-2 py-1">Quoc tich: {item.nationality}</span> : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-red-50 text-red-700"
                    aria-label="Xoa phan hoi"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">{item.message}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-[var(--line)] p-10 text-center text-sm font-bold text-[var(--muted)]">
            Chua co phan hoi nao.
          </div>
        )}
      </section>
    </div>
  );
}

function SiteSettings({
  site,
  setSite,
}: {
  site: SiteContent["site"];
  setSite: React.Dispatch<React.SetStateAction<SiteContent["site"]>>;
}) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const setLoc = (field: keyof SiteContent["site"], lang: Lang, value: string) => {
    setSite((prev) => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
  };

  const save = async () => {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(site),
    });
    setMsg(res.ok ? "Da luu cau hinh site" : "Luu cau hinh that bai");
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {msg ? <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-bold text-green-800">{msg}</div> : null}
      <section className="rounded-2xl bg-white/88 p-5 shadow">
        <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-[var(--ocean)]">Cau hinh trang chu</h3>
        <div className="space-y-4">
          <BilingualField label="Ten site" vi={site.name.vi} en={site.name.en} onVi={(v) => setLoc("name", "vi", v)} onEn={(v) => setLoc("name", "en", v)} />
          <BilingualField label="Tagline" vi={site.tagline.vi} en={site.tagline.en} onVi={(v) => setLoc("tagline", "vi", v)} onEn={(v) => setLoc("tagline", "en", v)} />
          <BilingualField label="Mo ta" vi={site.description.vi} en={site.description.en} onVi={(v) => setLoc("description", "vi", v)} onEn={(v) => setLoc("description", "en", v)} multiline rows={4} />
        </div>
      </section>
      <button type="button" onClick={save} disabled={saving} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--ocean)] px-6 font-black text-white disabled:opacity-50">
        <Save className="size-5" />
        {saving ? "Dang luu..." : "Luu cau hinh"}
      </button>
    </div>
  );
}

export function AdminDashboard({ content }: { content: SiteContent }) {
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("stops");
  const [site, setSite] = useState(content.site);
  const [stops, setStops] = useState<Stop[]>(content.stops);
  const [news, setNews] = useState<NewsPost[]>(content.news);
  const [selectedStopId, setSelectedStopId] = useState<number>(content.stops[0]?.id ?? 1);
  const [selectedNewsId, setSelectedNewsId] = useState<number>(content.news[0]?.id ?? 0);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [creating, setCreating] = useState(false);
  const [stopMobileView, setStopMobileView] = useState<"list" | "editor">("list");

  const selectedStop = stops.find((stop) => stop.id === selectedStopId);

  const updateStop = useCallback((patch: Partial<Stop>) => {
    setStops((prev) => prev.map((stop) => (stop.id === selectedStopId ? { ...stop, ...patch } : stop)));
  }, [selectedStopId]);

  // Auto-clear save message after 4 s
  useEffect(() => {
    if (!saveMsg) return;
    const t = setTimeout(() => setSaveMsg(""), 4000);
    return () => clearTimeout(t);
  }, [saveMsg]);

  const saveStop = async () => {
    if (!selectedStop) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch(`/api/stops/${selectedStop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedStop),
      });
      const data = await res.json() as { message?: string };
      setSaveMsg(res.ok ? "✅ Đã lưu điểm dừng" : `❌ Lỗi: ${data.message ?? "Lưu thất bại"}`);
    } catch {
      setSaveMsg("❌ Mất kết nối — thử lại");
    }
    setSaving(false);
  };

  const deleteStop = async () => {
    if (!selectedStop || !confirm(`Xoa diem "${selectedStop.title.vi}"?`)) return;
    const res = await fetch(`/api/stops/${selectedStop.id}`, { method: "DELETE" });
    if (res.ok) {
      const remaining = stops.filter((stop) => stop.id !== selectedStop.id);
      setStops(remaining);
      setSelectedStopId(remaining[0]?.id ?? 0);
    }
  };

  const createStop = async () => {
    setCreating(true);
    const res = await fetch("/api/stops", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    if (res.ok) {
      const newStop = (await res.json()) as Stop;
      setStops((prev) => [...prev, newStop]);
      setSelectedStopId(newStop.id);
      setTab("stops");
      setStopMobileView("editor");
    }
    setCreating(false);
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const tabs: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "stops", label: "Diem dung", icon: LayoutDashboard },
    { id: "news", label: "Tin tuc", icon: Newspaper },
    { id: "feedback", label: "Phan hoi", icon: MessageSquareText },
    { id: "qr", label: "QR code", icon: QrCode },
    { id: "stats", label: "Thong ke", icon: BarChart3 },
    { id: "site", label: "Cau hinh", icon: Settings },
  ];

  return (
    <div className="min-h-screen">
      <div className="sticky top-16 z-30 border-b border-[var(--line)] bg-[var(--shell)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[var(--ocean)]">Admin CMS</p>
              <h2 className="text-lg font-black text-[var(--ink)]">Quan ly he thong Dia dao Ky Anh</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={createStop} disabled={creating} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--bamboo)] px-4 text-sm font-bold text-white disabled:opacity-50">
                <FilePlus className="size-4" />
                {creating ? "Dang tao..." : "Them diem moi"}
              </button>
              <button type="button" onClick={logout} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--line)] px-4 text-sm font-bold text-[var(--muted)]">
                <LogOut className="size-4" />
                Dang xuat
              </button>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-black ${tab === item.id ? "bg-[var(--ocean)] text-white" : "border border-[var(--line)] bg-white text-[var(--muted)]"}`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {tab === "stops" ? (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Sidebar — ẩn trên mobile khi đang xem editor */}
            <aside className={`rounded-2xl border border-[var(--line)] bg-white/88 p-2 shadow-lg ${stopMobileView === "editor" ? "hidden lg:block" : "block"}`}>
              <p className="px-3 pb-2 pt-1 text-xs font-black uppercase tracking-widest text-[var(--muted)]">Danh sách điểm dừng</p>
              {[...stops].sort((a, b) => a.id - b.id).map((stop) => (
                <button
                  key={stop.id}
                  type="button"
                  onClick={() => { setSelectedStopId(stop.id); setStopMobileView("editor"); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${selectedStopId === stop.id ? "bg-[var(--ocean)] text-white" : "hover:bg-[var(--sand-soft)]"}`}
                >
                  <span className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-black ${selectedStopId === stop.id ? "bg-white/20" : "bg-[var(--sand-soft)] text-[var(--ocean)]"}`}>
                    {stop.id}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{stop.title.vi}</span>
                    <span className={`block truncate text-xs ${selectedStopId === stop.id ? "text-white/70" : "text-[var(--muted)]"}`}>{stop.duration}</span>
                  </span>
                  <ChevronRight className="size-4 shrink-0" />
                </button>
              ))}
            </aside>

            {/* Editor — ẩn trên mobile khi đang xem danh sách */}
            <main className={stopMobileView === "list" ? "hidden lg:block" : "block"}>
              {/* Nút quay lại danh sách (chỉ hiện trên mobile) */}
              <button
                type="button"
                onClick={() => setStopMobileView("list")}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-bold text-[var(--muted)] lg:hidden"
              >
                ← Danh sách
              </button>

              {saveMsg ? (
                <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-bold ${
                  saveMsg.startsWith("✅") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                }`}>
                  {saveMsg}
                </div>
              ) : null}

              {selectedStop ? (
                <>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-2xl bg-[var(--ocean)] text-lg font-black text-white">{selectedStop.id}</span>
                    <div>
                      <h2 className="text-xl font-black text-[var(--ink)]">{selectedStop.title.vi}</h2>
                      <p className="text-sm text-[var(--muted)]">{selectedStop.title.en}</p>
                    </div>
                    <Pencil className="ml-auto size-5 text-[var(--muted)]" />
                  </div>
                  <StopEditor stop={selectedStop} onChange={updateStop} onSave={saveStop} onDelete={deleteStop} saving={saving} />
                </>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-[var(--line)] p-12 text-center text-[var(--muted)]">
                  Chọn điểm dừng từ danh sách để chỉnh sửa.
                </div>
              )}
            </main>
          </div>
        ) : null}

        {tab === "news" ? <NewsEditor posts={news} selectedId={selectedNewsId} setSelectedId={setSelectedNewsId} setPosts={setNews} /> : null}
        {tab === "feedback" ? <FeedbackManager /> : null}
        {tab === "qr" ? <QRManager stops={stops} /> : null}
        {tab === "stats" ? <StatsPanel stops={stops} /> : null}
        {tab === "site" ? <SiteSettings site={site} setSite={setSite} /> : null}
      </div>
    </div>
  );
}
