import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StopDetailClient } from "@/components/StopDetailClient";
import { getStops } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const stops = await getStops();
  const stop = stops.find((s) => s.id === Number(id));
  if (!stop) return {};
  return {
    title: `${stop.title.vi} / ${stop.title.en}`,
    description: stop.summary.vi,
    openGraph: { title: stop.title.vi, description: stop.summary.vi },
  };
}

export default async function StopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stops = await getStops();
  const stop = stops.find((item) => item.id === Number(id));

  if (!stop) notFound();

  return <StopDetailClient stop={stop} />;
}
