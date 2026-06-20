import { NextResponse } from "next/server";
import { getContent, updateStop } from "@/lib/content";
import { isAdminAuthenticated } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";
import type { Stop } from "@/types/content";

const stopsPath = path.join(process.cwd(), "data", "stops.json");

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const content = await getContent();
  const stop = content.stops.find((s) => s.id === Number(id));
  if (!stop) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(stop);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json()) as Partial<Stop>;

  try {
    const updated = await updateStop(Number(id), body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Could not update stop" },
      { status: 400 },
    );
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const content = await getContent();
  const index = content.stops.findIndex((s) => s.id === Number(id));
  if (index < 0) return NextResponse.json({ message: "Not found" }, { status: 404 });

  content.stops.splice(index, 1);
  await fs.writeFile(stopsPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  return NextResponse.json({ ok: true });
}
