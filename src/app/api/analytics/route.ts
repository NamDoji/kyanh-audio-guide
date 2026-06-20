import { NextResponse } from "next/server";
import { appendVisit } from "@/lib/content";
import type { VisitPayload } from "@/types/content";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as VisitPayload | null;
  if (!payload?.path) return NextResponse.json({ message: "Missing path" }, { status: 400 });

  await appendVisit(payload, request);
  return NextResponse.json({ ok: true });
}
