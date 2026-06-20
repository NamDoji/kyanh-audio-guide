import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getNewsPosts, upsertNewsPost } from "@/lib/content";
import type { NewsPost } from "@/types/content";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await getNewsPosts(true));
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Partial<NewsPost> | null;
  if (!body) return NextResponse.json({ message: "Invalid body" }, { status: 400 });

  const post = await upsertNewsPost(body);
  return NextResponse.json(post, { status: 201 });
}
