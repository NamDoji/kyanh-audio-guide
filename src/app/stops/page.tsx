import { StopsPageClient } from "@/components/StopsPageClient";
import { getStops } from "@/lib/content";

export default async function StopsPage() {
  const stops = await getStops();
  return <StopsPageClient stops={stops} />;
}
