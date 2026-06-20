import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getContent } from "@/lib/content";
import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata = { title: "Admin – Kỳ Anh Audio Guide" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const auth = await isAdminAuthenticated();
  if (!auth) redirect("/admin/login");

  const content = await getContent();
  return <AdminDashboard content={content} />;
}
