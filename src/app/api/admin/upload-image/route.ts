import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAdminAuthenticated } from "@/lib/auth";
import { updateStop } from "@/lib/content";

const IMG_DIR = path.join(process.cwd(), "public", "images");
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) return NextResponse.json({ message: "Invalid form data" }, { status: 400 });

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ message: "No file provided" }, { status: 400 });

  const stopIdRaw = formData.get("stopId");
  const stopId = typeof stopIdRaw === "string" ? Number(stopIdRaw) : NaN;
  if (!Number.isInteger(stopId) || stopId < 1) {
    return NextResponse.json({ message: "Missing valid stopId" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ message: "Invalid type. Allowed: jpg, png, webp, svg" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ message: "File quá lớn (max 20 MB)" }, { status: 400 });
  }

  const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const ext = ["jpg", "jpeg", "png", "webp", "svg"].includes(rawExt) ? rawExt : "jpg";
  const sanitized = `stop${stopId}_image_${Date.now()}.${ext}`
    .replace(/[^a-zA-Z0-9_\-\.]/g, "")
    .toLowerCase();
  await fs.mkdir(IMG_DIR, { recursive: true });
  const destPath = path.join(IMG_DIR, sanitized);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(destPath, buffer);

  const publicPath = `/images/${sanitized}`;
  const updated = await updateStop(stopId, { image: publicPath });

  return NextResponse.json({ ok: true, path: publicPath, filename: sanitized, stop: updated });
}
