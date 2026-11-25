import type { Metadata } from "next";
import { GioiThieuClient } from "@/components/GioiThieuClient";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Giới thiệu / About",
};

export default async function GioiThieuPage() {
  const content = await getContent();
  return <GioiThieuClient site={content.site} />;
}
