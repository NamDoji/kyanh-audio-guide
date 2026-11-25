import type { Metadata } from "next";
import { HomeClient } from "@/components/HomeClient";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Địa đạo Kỳ Anh Audio Guide",
  description: "Thuyết minh tự động song ngữ Việt–Anh cho Di tích Địa đạo Kỳ Anh. Quét QR tại từng điểm để nghe câu chuyện lịch sử tại chỗ.",
};

export default async function Home() {
  const content = await getContent();
  return <HomeClient content={content} />;
}
