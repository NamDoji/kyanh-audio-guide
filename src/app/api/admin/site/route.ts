import { NextResponse } from "next/server";
import { getAdminRole } from "@/lib/auth";
import { getContent, saveContent } from "@/lib/content";
import type { SiteContent } from "@/types/content";

export async function PUT(request: Request) {
  const role = await getAdminRole();
  if (!role) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (role !== "admin") return NextResponse.json({ message: "Admin role required" }, { status: 403 });

  const body = (await request.json().catch(() => null)) as Partial<SiteContent["site"]> | null;
  if (!body?.name || !body.tagline || !body.description) {
    return NextResponse.json({ message: "Invalid site content" }, { status: 400 });
  }

  const content = await getContent();
  content.site = body as SiteContent["site"];
  await saveContent(content);
  return NextResponse.json(content.site);
}
