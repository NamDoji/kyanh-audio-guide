import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getFeedbackRecords } from "@/lib/content";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const feedback = await getFeedbackRecords();
  return NextResponse.json(feedback.slice().reverse());
}
