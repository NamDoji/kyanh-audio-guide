"use client";

import Image from "next/image";
import { Compass } from "lucide-react";
import type { SiteContent } from "@/types/content";
import { usePreferences } from "./PreferenceProvider";

export function GioiThieuClient({ site }: { site: SiteContent["site"] }) {
  const { lang } = usePreferences();

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--ocean)]">
        {lang === "vi" ? "Giới thiệu" : "About"}
      </p>
      <h1 className="heritage-title mt-3 text-4xl font-black leading-tight text-[var(--ink)] sm:text-5xl">
        {site.name[lang]}
      </h1>

      <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-[2rem] shadow-xl">
        <Image
          src="/images/tunnel-entrance.svg"
          alt={lang === "vi" ? "Địa đạo Kỳ Anh" : "Ky Anh Tunnels"}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="mt-8 space-y-6 text-lg leading-9 text-[var(--muted)]">
        {lang === "vi" ? (
          <>
            <p>
              <strong className="font-black text-[var(--ink)]">Địa đạo Kỳ Anh</strong> là Di tích Lịch sử Quốc gia tọa lạc tại xã Tam Anh Nam, huyện Núi Thành, tỉnh Quảng Nam. Được xây dựng từ năm 1965 bởi nhân dân địa phương trong thời kỳ kháng chiến chống Mỹ, hệ thống địa đạo dài khoảng 32 km từng là nơi trú ẩn và sinh hoạt của hơn 1.500 người dân.
            </p>
            <p>
              Địa đạo chạy sâu dưới lòng đất, nối liền các thôn xóm trong khu vực, tạo thành một mạng lưới liên thông phức tạp. Nhân dân Kỳ Anh đã kiên cường bám trụ dưới lòng đất, duy trì cuộc sống và tham gia chiến đấu bảo vệ quê hương trong suốt những năm tháng chiến tranh ác liệt.
            </p>
            <p>
              Ngày nay, Địa đạo Kỳ Anh được bảo tồn và phát huy giá trị lịch sử, trở thành điểm tham quan giáo dục truyền thống yêu nước cho các thế hệ. Hệ thống audio guide này giúp du khách tự khám phá từng điểm dừng bằng ngôn ngữ của mình, lắng nghe câu chuyện lịch sử ngay tại nơi nó diễn ra.
            </p>
          </>
        ) : (
          <>
            <p>
              <strong className="font-black text-[var(--ink)]">The Ky Anh Tunnels</strong> are a National Historical Site located in Tam Anh Nam commune, Nui Thanh district, Quang Nam province. Built from 1965 by local residents during the resistance war, the tunnel network stretches approximately 32 kilometres and once sheltered more than 1,500 people.
            </p>
            <p>
              The tunnels run deep underground, connecting the surrounding villages in a complex network. The people of Ky Anh persevered beneath the earth, maintaining daily life and participating in the defence of their homeland throughout the most intense years of the war.
            </p>
            <p>
              Today, the Ky Anh Tunnels are preserved as a site of historical and patriotic education for future generations. This audio guide system helps visitors explore each stop in their own language, hearing each story exactly where it unfolded.
            </p>
          </>
        )}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { value: "1965", vi: "Năm khởi công", en: "Year built" },
          { value: "32 km", vi: "Chiều dài hệ thống", en: "Network length" },
          { value: "1,500+", vi: "Người được che chở", en: "People sheltered" },
        ].map((stat) => (
          <div key={stat.value} className="rounded-[1.5rem] bg-[var(--sand-soft)] p-5 text-center">
            <p className="text-3xl font-black text-[var(--earth)]">{stat.value}</p>
            <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{stat[lang]}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-start gap-4 rounded-[2rem] bg-[var(--ocean)] p-6 text-white shadow-lg">
        <Compass aria-hidden className="mt-1 size-8 shrink-0 text-[var(--sand)]" />
        <div>
          <h2 className="text-lg font-black">
            {lang === "vi" ? "Hướng dẫn tham quan" : "Visitor guide"}
          </h2>
          <p className="mt-2 text-white/85">
            {lang === "vi"
              ? "Quét mã QR tại mỗi biển thông tin để nghe thuyết minh trực tiếp tại điểm dừng. Vui lòng đi theo biển báo thực địa và hướng dẫn của nhân viên khu di tích."
              : "Scan the QR code at each information board to listen to the audio narration on the spot. Please follow onsite signs and the guidance of heritage site staff."}
          </p>
        </div>
      </div>
    </article>
  );
}
