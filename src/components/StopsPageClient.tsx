"use client";

import type { Stop } from "@/types/content";
import { StopCard } from "./StopCard";
import { usePreferences } from "./PreferenceProvider";

export function StopsPageClient({ stops }: { stops: Stop[] }) {
  const { lang } = usePreferences();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--ocean)]">
          {lang === "vi" ? "6 điểm dừng" : "6 stops"}
        </p>
        <h1 className="heritage-title mt-3 text-4xl font-black text-[var(--ink)] sm:text-5xl">
          {lang === "vi" ? "Tuyến tham quan Địa đạo Kỳ Anh" : "Ky Anh tunnel visitor route"}
        </h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
          {lang === "vi"
            ? "Mỗi điểm có trang QR riêng, audio song ngữ, tóm tắt, hình ảnh, vị trí và gợi ý suy ngẫm."
            : "Each stop has its own QR page, bilingual audio, short summary, image, location and reflection prompt."}
        </p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {stops.map((stop) => (
          <StopCard key={stop.id} stop={stop} lang={lang} />
        ))}
      </div>
    </section>
  );
}
