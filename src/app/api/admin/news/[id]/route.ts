import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteNewsPost, getNewsPost, upsertNewsPost } from "@/lib/content";
import type { NewsPost } from "@/types/content";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await getNewsPost(Number(id));
  if (!post) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Partial<NewsPost> | null;
  if (!body) return NextResponse.json({ message: "Invalid body" }, { status: 400 });

  const post = await upsertNewsPost({ ...body, id: Number(id) });
  return NextResponse.json(post);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await deleteNewsPost(Number(id));
  return NextResponse.json({ ok: true });
}
