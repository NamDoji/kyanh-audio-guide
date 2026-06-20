"use client";

import Link from "next/link";
import { usePreferences } from "./PreferenceProvider";

export function Footer() {
  const { lang } = usePreferences();

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--shell)] pb-24 pt-10 md:pb-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--ocean)]">
            Ky Anh Audio Guide
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            {lang === "vi"
              ? "Một website hướng dẫn tham quan tự động, ưu tiên trải nghiệm di động, audio song ngữ và khả năng vận hành bằng QR tại từng điểm dừng."
              : "A mobile-first audio guide website with bilingual storytelling, QR-based stop access and simple content operations for site staff."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-[var(--muted)]">
          <Link href="/credits" className="min-h-11 rounded-full py-3 hover:text-[var(--ocean)]">
            {lang === "vi" ? "Ghi nhận" : "Credits"}
          </Link>
          <Link href="/admin" className="min-h-11 rounded-full py-3 hover:text-[var(--ocean)]">
            Admin
          </Link>
          <Link href="/qr" className="min-h-11 rounded-full py-3 hover:text-[var(--ocean)]">
            QR
          </Link>
          <Link href="/feedback" className="min-h-11 rounded-full py-3 hover:text-[var(--ocean)]">
            {lang === "vi" ? "Phản hồi" : "Feedback"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
