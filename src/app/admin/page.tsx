import { AdminEditor } from "@/components/AdminEditor";
import { getContent } from "@/lib/content";

export default async function AdminPage() {
  const content = await getContent();
  return <AdminEditor content={content} />;
}
