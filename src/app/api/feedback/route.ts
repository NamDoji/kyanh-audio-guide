import { NextResponse } from "next/server";
import { appendFeedback } from "@/lib/content";
import type { FeedbackPayload } from "@/types/content";

export async function POST(request: Request) {
  const payload = (await request.json()) as FeedbackPayload;

  if (!payload.name || !payload.message || !payload.rating) {
    return NextResponse.json({ message: "Missing required feedback fields" }, { status: 400 });
  }

  await appendFeedback(payload);
  return NextResponse.json({ ok: true });
}
