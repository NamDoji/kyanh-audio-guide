"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, ScrollText, Volume2 } from "lucide-react";
import type { Lang, Stop } from "@/types/content";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function AudioPlayer({ stop, lang }: { stop: Stop; lang: Lang }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const audioSrc = stop.audio[lang];

  // Reset player state whenever source or lang changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setError("");
    setLoaded(false);
    audio.load();
  }, [audioSrc]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        // Reload in case browser suspended it
        if (audio.readyState === 0) audio.load();
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
        setPlaying(true);
        setError("");
      }
    } catch (err) {
      const msg = lang === "vi"
        ? "Không phát được audio. Nhấn lại hoặc xem transcript bên dưới."
        : "Could not play audio. Try again or read the transcript below.";
      setError(msg);
      setPlaying(false);
    }
  };

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const next = (value / 100) * duration;
    audio.currentTime = next;
    setProgress(value);
    setCurrentTime(next);
  };

  const replay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setProgress(0);
    setCurrentTime(0);
    setPlaying(false);
  };

  return (
    <section
      className="rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur tunnel:border-stone-700 tunnel:bg-stone-950/80 sm:p-6"
      aria-label={lang === "vi" ? "Trình phát audio" : "Audio player"}
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          setLoaded(true);
        }}
        onTimeUpdate={(e) => {
          const a = e.currentTarget;
          setCurrentTime(a.currentTime);
          setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
        }}
        onEnded={() => setPlaying(false)}
        onError={() => {
          setError(
            lang === "vi"
              ? "File audio demo chưa sẵn sàng. Hãy xem nội dung qua transcript."
              : "Demo audio file is not ready. Please read the transcript instead."
          );
          setLoaded(false);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={audioSrc} type="audio/mp4" />
        <source src={audioSrc.replace(".m4a", ".mp3")} type="audio/mpeg" />
      </audio>

      {/* Main player row */}
      <div className="flex items-center gap-4">
        {/* Big play/pause button */}
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? (lang === "vi" ? "Tạm dừng" : "Pause") : (lang === "vi" ? "Phát audio" : "Play audio")}
          className="grid size-16 shrink-0 cursor-pointer place-items-center rounded-full bg-[var(--ocean)] text-white shadow-lg transition-transform active:scale-95 hover:scale-105 focus-visible:outline-4 focus-visible:outline-[var(--ocean)]"
          style={{ minWidth: 64, minHeight: 64 }}
        >
          {playing
            ? <Pause aria-hidden className="size-7" />
            : <Play aria-hidden className="ml-1 size-7" />}
        </button>

        <div className="min-w-0 flex-1">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">
                {lang === "vi" ? "Audio thuyết minh" : "Audio guide"}
              </p>
              <p className="mt-0.5 truncate text-base font-black text-[var(--ink)]">
                {stop.title[lang]}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[var(--sand-soft)] px-3 py-1 text-xs font-bold text-[var(--earth)]">
              {loaded && duration > 0 ? formatTime(duration) : stop.duration}
            </span>
          </div>

          {/* Progress bar */}
          <label className="sr-only" htmlFor={`progress-${stop.id}`}>Audio progress</label>
          <input
            id={`progress-${stop.id}`}
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            className="mt-3 h-3 w-full cursor-pointer accent-[var(--ocean)]"
            aria-label="Seek audio"
          />

          {/* Time display */}
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted)]">
            <span>{formatTime(currentTime)}</span>
            <span>{loaded && duration > 0 ? formatTime(duration) : "--:--"}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={replay}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--sand-soft)] tunnel:bg-stone-900 tunnel:hover:bg-stone-800"
          aria-label={lang === "vi" ? "Nghe lại từ đầu" : "Replay from beginning"}
        >
          <RotateCcw aria-hidden className="size-4" />
          {lang === "vi" ? "Nghe lại" : "Replay"}
        </button>

        <button
          type="button"
          onClick={() => setShowTranscript((v) => !v)}
          aria-expanded={showTranscript}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--sand-soft)] tunnel:bg-stone-900 tunnel:hover:bg-stone-800"
        >
          <ScrollText aria-hidden className="size-4" />
          {showTranscript
            ? (lang === "vi" ? "Ẩn transcript" : "Hide transcript")
            : (lang === "vi" ? "Xem transcript" : "Show transcript")}
        </button>

        <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--teal-soft)] px-4 text-sm font-bold text-[var(--ocean)]">
          <Volume2 aria-hidden className="size-4" />
          {lang === "vi" ? "Dùng tai nghe, âm lượng vừa" : "Use headphones, moderate volume"}
        </span>
      </div>

      {/* Error message */}
      {error && (
        <div role="alert" className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
          ⚠️ {error}
        </div>
      )}

      {/* Transcript */}
      {showTranscript && (
        <div className="mt-4 rounded-3xl bg-[var(--sand-soft)] p-5 text-base leading-8 text-[var(--ink)] tunnel:bg-stone-900">
          <p className="mb-2 text-xs font-black uppercase tracking-widest text-[var(--muted)]">
            {lang === "vi" ? "Nội dung thuyết minh" : "Transcript"}
          </p>
          <p className="whitespace-pre-wrap">{stop.transcript[lang]}</p>
        </div>
      )}
    </section>
  );
}
