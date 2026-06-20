import { QrPageClient } from "@/components/QrPageClient";
import { absoluteUrl, getStops } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function QrPage() {
  const stops = await getStops();
  return <QrPageClient stops={stops} baseUrl={absoluteUrl("/")} />;
}
