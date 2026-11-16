import { NextResponse } from "next/server";
import { isAdminAuthenticated, getAdminRole } from "@/lib/auth";
import { saveContact } from "@/lib/content";
import type { SiteContact } from "@/types/content";

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const role = await getAdminRole();
  if (role !== "admin") {
    return NextResponse.json({ message: "Admin role required" }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as SiteContact | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ message: "Invalid body" }, { status: 400 });
  }

  const existing = await import("@/lib/content").then((m) => m.getContent()).then((c) => c.contact ?? {});
  const merged: SiteContact = { ...existing, ...body };
  await saveContact(merged);
  return NextResponse.json({ ok: true });
}
