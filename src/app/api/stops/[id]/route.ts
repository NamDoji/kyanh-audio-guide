import { NextResponse } from "next/server";
import { updateStop } from "@/lib/content";
import type { Stop } from "@/types/content";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
