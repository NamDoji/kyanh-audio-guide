import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

const groups = [
  "Ban Quản lý di tích Địa đạo Kỳ Anh",
  "Các cựu chiến binh, nhân chứng và người dân địa phương",
  "Nhóm nội dung lịch sử và biên tập song ngữ",
  "Nhóm thu âm, thiết kế trải nghiệm và kỹ thuật",
];

export default function CreditsPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--ocean)]">Credits</p>
      <h1 className="heritage-title mt-3 text-4xl font-black text-[var(--ink)] sm:text-5xl">
        Ghi nhận / Acknowledgements
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">
        Dự án audio guide này được thiết kế như một nền tảng mở rộng được, tôn trọng ký ức địa phương và ưu tiên trải nghiệm của khách tham quan trong nước, quốc tế.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <div key={group} className="rounded-[2rem] border border-[var(--line)] bg-white/88 p-6 shadow-lg tunnel:bg-stone-950/80">
            <h2 className="text-xl font-black text-[var(--ink)]">{group}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Trân trọng ghi nhận đóng góp về tư liệu, ký ức, giọng kể, hình ảnh, thiết kế và vận hành.
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-[2rem] bg-[var(--ocean)] p-6 text-white">
        <h2 className="text-2xl font-black">Liên hệ / Contact</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <a href="mailto:info@example.com" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 font-black text-[var(--ocean)]">
            <Mail aria-hidden className="size-5" />
            info@example.com
          </a>
          <Link href="/feedback" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/45 px-5 font-black text-white">
            <MessageCircle aria-hidden className="size-5" />
            Gửi phản hồi
          </Link>
        </div>
      </div>
    </section>
  );
}
