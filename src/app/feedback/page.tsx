import { FeedbackForm } from "@/components/FeedbackForm";

export default function FeedbackPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--ocean)]">Feedback</p>
      <h1 className="heritage-title mt-3 text-4xl font-black text-[var(--ink)] sm:text-5xl">
        Phản hồi / Visitor feedback
      </h1>
      <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
        Góp ý của quý khách giúp hoàn thiện nội dung thuyết minh, chất lượng âm thanh và trải nghiệm tham quan tại di tích.
      </p>
      <div className="mt-8">
        <FeedbackForm />
      </div>
    </section>
  );
}
