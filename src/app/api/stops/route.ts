import { NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/content";
import { isAdminAuthenticated } from "@/lib/auth";
import type { Stop } from "@/types/content";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content.stops.sort((a, b) => a.id - b.id));
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as Partial<Stop> | null;
  if (!body) return NextResponse.json({ message: "Invalid body" }, { status: 400 });

  const content = await getContent();
  const maxId = content.stops.reduce((m, s) => Math.max(m, s.id), 0);
  const newId = maxId + 1;

  const blank: Stop = {
    id: newId,
    slug: body.slug ?? `stop-${newId}`,
    title: body.title ?? { vi: `Điểm ${newId}`, en: `Stop ${newId}` },
    subtitle: body.subtitle ?? { vi: "", en: "" },
    summary: body.summary ?? { vi: "", en: "" },
    transcript: body.transcript ?? { vi: "", en: "" },
    location: body.location ?? { vi: "", en: "" },
    highlights: body.highlights ?? { vi: [], en: [] },
    reflection: body.reflection ?? { vi: "", en: "" },
    duration: body.duration ?? "~2 min",
    image: body.image ?? "/images/tunnel-entrance.svg",
    audio: body.audio ?? { vi: `/audio/stop${newId}_vi.m4a`, en: `/audio/stop${newId}_en.m4a` },
    qrPath: `/stops/${newId}`,
    mapPosition: body.mapPosition ?? { x: 50, y: 50 },
  };

  content.stops.push(blank);
  await saveContent(content);
  return NextResponse.json(blank, { status: 201 });
}
