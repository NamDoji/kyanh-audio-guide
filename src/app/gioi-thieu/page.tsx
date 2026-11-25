import type { Metadata } from "next";
import { GioiThieuClient } from "@/components/GioiThieuClient";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Địa đạo Kỳ Anh — Di tích Lịch sử Quốc gia tại Quảng Nam. Được xây dựng từ năm 1965, hệ thống địa đạo dài 32 km từng che chở hơn 1.500 người.",
};

export default async function GioiThieuPage() {
  const content = await getContent();
  return <GioiThieuClient site={content.site} />;
}
