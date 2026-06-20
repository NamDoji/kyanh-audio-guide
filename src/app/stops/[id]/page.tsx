import { notFound } from "next/navigation";
import { StopDetailClient } from "@/components/StopDetailClient";
import { getStops } from "@/lib/content";

export async function generateStaticParams() {
  const stops = await getStops();
  return stops.map((stop) => ({ id: String(stop.id) }));
}

export default async function StopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stops = await getStops();
  const stop = stops.find((item) => item.id === Number(id));

  if (!stop) notFound();

  const previous = stops.find((item) => item.id === stop.id - 1);
  const next = stops.find((item) => item.id === stop.id + 1);

  return <StopDetailClient stop={stop} previous={previous} next={next} />;
}
