"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, ScrollText, Volume2 } from "lucide-react";
import type { Lang, Stop } from "@/types/content";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}

export function AudioPlayer({ stop, lang }: { stop: Stop; lang: Lang }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [error, setError] = useState("");
  const audioSrc = stop.audio[lang];

  useEffect(() => {
    audioRef.current?.pause();
    audioRef.current?.load();
    queueMicrotask(() => {
      setPlaying(false);
      setProgress(0);
      setError("");
    });
  }, [audioSrc]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        await audio.play();
        setPlaying(true);
      }
    } catch {
      setError(lang === "vi" ? "Chưa phát được audio. Vui lòng thử lại hoặc xem transcript." : "Audio could not play yet. Please try again or open the transcript.");
      setPlaying(false);
    }
  };

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const next = (value / 100) * duration;
    audio.currentTime = next;
    setProgress(value);
  };

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/88 p-4 shadow-xl backdrop-blur tunnel:border-stone-700 tunnel:bg-stone-950/80 sm:p-5">
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => {
          const audio = event.currentTarget;
          setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
        }}
        onEnded={() => setPlaying(false)}
        onError={() => setError(lang === "vi" ? "Audio demo chưa sẵn sàng. Nội dung transcript vẫn dùng được." : "Demo audio is not ready. The transcript remains available.")}
      />

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause audio" : "Play audio"}
          className="grid size-16 shrink-0 place-items-center rounded-full bg-[var(--ocean)] text-white shadow-lg transition hover:scale-105"
        >
          {playing ? <Pause aria-hidden className="size-7" /> : <Play aria-hidden className="ml-1 size-7" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--muted)]">
                {lang === "vi" ? "Audio thuyết minh" : "Audio guide"}
              </p>
              <p className="mt-1 truncate text-base font-black text-[var(--ink)]">
                {stop.title[lang]}
              </p>
            </div>
            <span className="rounded-full bg-[var(--sand-soft)] px-3 py-1 text-xs font-bold text-[var(--earth)]">
              {duration ? formatTime(duration) : stop.duration}
            </span>
          </div>
          <label className="sr-only" htmlFor={`audio-progress-${stop.id}`}>
            Audio progress
          </label>
          <input
            id={`audio-progress-${stop.id}`}
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(event) => seek(Number(event.target.value))}
            className="mt-4 h-3 w-full accent-[var(--ocean)]"
          />
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted)]">
            <span>{formatTime(((duration || 0) * progress) / 100)}</span>
            <span>{duration ? formatTime(duration) : stop.duration}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            if (audioRef.current) audioRef.current.currentTime = 0;
            setProgress(0);
          }}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] px-4 text-sm font-bold"
          aria-label="Replay from beginning"
        >
          <RotateCcw aria-hidden className="size-4" />
          {lang === "vi" ? "Nghe lại" : "Replay"}
        </button>
        <button
          type="button"
          onClick={() => setShowTranscript((value) => !value)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] px-4 text-sm font-bold"
          aria-expanded={showTranscript}
        >
          <ScrollText aria-hidden className="size-4" />
          {lang === "vi" ? "Bật transcript" : "Transcript"}
        </button>
        <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--teal-soft)] px-4 text-sm font-bold text-[var(--ocean)]">
          <Volume2 aria-hidden className="size-4" />
          {lang === "vi" ? "Dùng tai nghe âm lượng vừa phải" : "Use headphones at a moderate volume"}
        </span>
      </div>

      {error && <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-900">{error}</p>}
      {showTranscript && (
        <div className="mt-4 rounded-3xl bg-[var(--sand-soft)] p-4 text-base leading-8 text-[var(--ink)]">
          {stop.transcript[lang]}
        </div>
      )}
    </section>
  );
}
