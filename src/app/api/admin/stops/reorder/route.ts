import { NextResponse } from "next/server";
import { reorderStop } from "@/lib/content";
import { isAdminAuthenticated } from "@/lib/auth";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as { stopId?: number; direction?: unknown } | null;
  if (!body?.stopId || (body.direction !== "up" && body.direction !== "down")) {
    return NextResponse.json({ message: "Missing or invalid stopId/direction" }, { status: 400 });
  }
  const direction = body.direction as "up" | "down";

  try {
    await reorderStop(body.stopId, direction);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : "Reorder failed" }, { status: 400 });
  }
}
