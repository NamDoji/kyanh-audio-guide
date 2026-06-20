import { MapPageClient } from "@/components/MapPageClient";
import { getStops } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const stops = await getStops();
  return <MapPageClient stops={stops} />;
}
