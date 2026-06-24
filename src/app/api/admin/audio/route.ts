import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getStop, updateStop } from "@/lib/content";
import type { Lang } from "@/types/content";

/** PATCH /api/admin/audio — save a blob URL to a stop's audio field after client-side upload */
export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request
    .json()
    .catch(() => null) as { stopId?: number; lang?: string; url?: string } | null;

  if (!body?.stopId || !body.lang || !body.url) {
    return NextResponse.json({ message: "Missing stopId, lang, or url" }, { status: 400 });
  }

  const lang: Lang | null = body.lang === "vi" || body.lang === "en" ? (body.lang as Lang) : null;
  if (!lang) return NextResponse.json({ message: "Invalid lang" }, { status: 400 });

  const current = await getStop(Number(body.stopId));
  if (!current) return NextResponse.json({ message: `Stop ${body.stopId} not found` }, { status: 404 });

  const updated = await updateStop(Number(body.stopId), {
    audio: { ...current.audio, [lang]: body.url },
  });

  return NextResponse.json({ ok: true, stop: updated });
}
