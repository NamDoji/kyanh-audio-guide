import type { Metadata } from "next";
import { StopsPageClient } from "@/components/StopsPageClient";
import { getStops } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tuyến tham quan",
  description: "Danh sách toàn bộ điểm dừng của tuyến tham quan Địa đạo Kỳ Anh. Mỗi điểm có audio song ngữ, tóm tắt và điểm đáng chú ý.",
};

export default async function StopsPage() {
  const stops = await getStops();
  return <StopsPageClient stops={stops} />;
}
