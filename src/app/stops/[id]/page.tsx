import { notFound } from "next/navigation";
import { StopDetailClient } from "@/components/StopDetailClient";
import { getStops } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const stops = await getStops();
  return stops.map((stop) => ({ id: String(stop.id) }));
}

export default async function StopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stops = await getStops();
  const stop = stops.find((item) => item.id === Number(id));

  if (!stop) notFound();

  const currentIdx = stops.findIndex((item) => item.id === stop.id);
  const previous = currentIdx > 0 ? stops[currentIdx - 1] : undefined;
  const next = currentIdx < stops.length - 1 ? stops[currentIdx + 1] : undefined;

  return <StopDetailClient stop={stop} previous={previous} next={next} />;
}
