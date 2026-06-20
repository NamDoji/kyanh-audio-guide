import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteFeedbackRecord } from "@/lib/content";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteFeedbackRecord(decodeURIComponent(id));
  if (!deleted) return NextResponse.json({ message: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
