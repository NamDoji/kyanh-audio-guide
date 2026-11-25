import { NextResponse } from "next/server";
import { appendVisit } from "@/lib/content";
import type { VisitPayload } from "@/types/content";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as VisitPayload | null;
  if (!payload?.path) return NextResponse.json({ message: "Missing path" }, { status: 400 });

  // Accept only relative paths that start with / to block external URL injection
  if (typeof payload.path !== "string" || !payload.path.startsWith("/") || payload.path.length > 300) {
    return NextResponse.json({ message: "Invalid path" }, { status: 400 });
  }

  await appendVisit(payload, request);
  return NextResponse.json({ ok: true });
}
