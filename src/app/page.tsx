import { HomeClient } from "@/components/HomeClient";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();
  return <HomeClient content={content} />;
}
