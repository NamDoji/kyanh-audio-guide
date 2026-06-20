"use client";

import { useRef } from "react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { Download } from "lucide-react";
import type { Lang, Stop } from "@/types/content";

export function QRCodeCard({ stop, lang, baseUrl }: { stop: Stop; lang: Lang; baseUrl: string }) {
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);
  const url = `${baseUrl.replace(/\/$/, "")}${stop.qrPath}`;

  const download = () => {
    const canvas = canvasWrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    const anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = `ky-anh-stop-${stop.id}-qr.png`;
    anchor.click();
  };

  return (
    <article className="rounded-[1.75rem] border border-[var(--line)] bg-white/90 p-5 shadow-lg tunnel:bg-stone-950/80">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--ocean)]">
            Stop {stop.id}
          </p>
          <h3 className="mt-2 text-lg font-black text-[var(--ink)]">{stop.title[lang]}</h3>
        </div>
        <button
          type="button"
          onClick={download}
          aria-label={`Download QR for stop ${stop.id}`}
          className="grid size-11 place-items-center rounded-full bg-[var(--sand-soft)] text-[var(--earth)]"
        >
          <Download aria-hidden className="size-5" />
        </button>
      </div>
      <div ref={canvasWrapRef} className="mt-5 grid place-items-center rounded-3xl bg-white p-4">
        <QRCodeCanvas value={url} size={180} includeMargin level="H" />
      </div>
      <Link href={stop.qrPath} className="mt-4 block truncate rounded-2xl bg-[var(--teal-soft)] px-4 py-3 text-sm font-bold text-[var(--ocean)]">
        {url}
      </Link>
    </article>
  );
}
