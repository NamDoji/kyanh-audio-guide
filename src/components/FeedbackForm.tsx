"use client";

import { useState } from "react";
import { Send, Star } from "lucide-react";
import { usePreferences } from "./PreferenceProvider";

export function FeedbackForm() {
  const { lang } = usePreferences();
  const [rating, setRating] = useState(5);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    setError("");
    const payload = {
      name: String(formData.get("name") || "").trim(),
      contact: String(formData.get("contact") || "").trim(),
      nationality: String(formData.get("nationality") || "").trim(),
      rating,
      message: String(formData.get("message") || "").trim(),
    };

    if (!payload.name || !payload.message) {
      setError(lang === "vi" ? "Vui lòng nhập tên và góp ý." : "Please enter your name and feedback.");
      return;
    }

    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setError(lang === "vi" ? "Chưa gửi được phản hồi. Vui lòng thử lại." : "Feedback was not sent. Please try again.");
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-[2rem] bg-[var(--teal-soft)] p-8 text-center">
        <p className="text-2xl font-black text-[var(--ocean)]">
          {lang === "vi" ? "Cảm ơn quý khách!" : "Thank you!"}
        </p>
        <p className="mt-3 text-[var(--muted)]">
          {lang === "vi"
            ? "Phản hồi đã được ghi nhận để cải thiện trải nghiệm tham quan."
            : "Your feedback has been saved to improve the visitor experience."}
        </p>
      </div>
    );
  }

  return (
    <form action={submit} className="rounded-[2rem] border border-[var(--line)] bg-white/90 p-5 shadow-xl tunnel:bg-stone-950/80 sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-[var(--ink)]">{lang === "vi" ? "Tên" : "Name"}</span>
          <input name="name" required className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-base text-slate-900" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-[var(--ink)]">{lang === "vi" ? "Email/SĐT tùy chọn" : "Email/phone optional"}</span>
          <input name="contact" className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-base text-slate-900" />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-bold text-[var(--ink)]">{lang === "vi" ? "Quốc tịch" : "Nationality"}</span>
          <input name="nationality" className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-base text-slate-900" />
        </label>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-bold text-[var(--ink)]">{lang === "vi" ? "Đánh giá" : "Rating"}</legend>
        <div className="mt-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} stars`}
              className={`grid size-12 place-items-center rounded-full border ${
                value <= rating ? "border-amber-400 bg-amber-100 text-amber-700" : "border-[var(--line)] text-[var(--muted)]"
              }`}
            >
              <Star aria-hidden className="size-5" fill={value <= rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mt-5 block">
        <span className="text-sm font-bold text-[var(--ink)]">{lang === "vi" ? "Góp ý" : "Feedback"}</span>
        <textarea
          name="message"
          required
          rows={6}
          className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-base leading-7 text-slate-900"
        />
      </label>

      {error && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
      <button type="submit" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--ocean)] px-6 text-base font-black text-white shadow-lg sm:w-auto">
        <Send aria-hidden className="size-5" />
        {lang === "vi" ? "Gửi phản hồi" : "Send feedback"}
      </button>
    </form>
  );
}
