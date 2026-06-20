import { NewsPageClient } from "@/components/NewsPageClient";
import { getNewsPosts } from "@/lib/content";

export const metadata = { title: "Tin tức" };
export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const posts = await getNewsPosts(false);
  return <NewsPageClient posts={posts} />;
}
