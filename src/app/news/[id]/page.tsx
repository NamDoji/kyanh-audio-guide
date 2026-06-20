import { notFound } from "next/navigation";
import { NewsDetailClient } from "@/components/NewsDetailClient";
import { getNewsPost } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getNewsPost(Number(id));
  if (!post || post.status !== "published") notFound();

  return <NewsDetailClient post={post} />;
}
