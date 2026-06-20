import { StopsPageClient } from "@/components/StopsPageClient";
import { getStops } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function StopsPage() {
  const stops = await getStops();
  return <StopsPageClient stops={stops} />;
}
