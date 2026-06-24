import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { promises as fs } from "fs";
import path from "path";
import { isAdminAuthenticated } from "@/lib/auth";
import { getStop, updateStop } from "@/lib/content";
import type { Lang } from "@/types/content";

const IS_VERCEL = !!process.env.VERCEL || !!process.env.BLOB_READ_WRITE_TOKEN;
const AUDIO_DIR = path.join(process.cwd(), "public", "audio");
const ALLOWED_TYPES = [
  "audio/mp4",
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/x-m4a",
  "audio/m4a",
  "audio/webm",
];
const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

/**
 * POST /api/admin/upload
 *
 * Two modes:
 *  - multipart/form-data  → legacy server-side upload (local dev, small files)
 *  - application/json     → @vercel/blob client-side upload token flow (production)
 *
 * The client-side flow (using `upload()` from @vercel/blob/client) uploads the
 * audio file DIRECTLY from the browser to Vercel Blob CDN, bypassing the 4.5 MB
 * serverless body limit entirely.
 */
export async function POST(request: Request): Promise<Response> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    return handleFormUpload(request);
  }

  // Client-side blob upload token flow
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        if (!(await isAdminAuthenticated())) {
          throw new Error("Unauthorized");
        }
        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_SIZE,
          tokenPayload: clientPayload ?? "",
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Best-effort save; client also calls /api/admin/audio as primary path
        try {
          const payload = JSON.parse(tokenPayload ?? "{}") as {
            stopId?: number;
            lang?: string;
          };
          const { stopId, lang } = payload;
          if (stopId && lang) {
            const current = await getStop(Number(stopId));
            if (current) {
              await updateStop(Number(stopId), {
                audio: { ...current.audio, [lang as Lang]: blob.url },
              });
            }
          }
        } catch {
          // non-fatal — client calls /api/admin/audio after upload
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

/** Handles multipart/form-data uploads (local dev or small-file fallback) */
async function handleFormUpload(request: Request): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) return NextResponse.json({ message: "Invalid form data" }, { status: 400 });

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ message: "No file provided" }, { status: 400 });

  const stopIdRaw = formData.get("stopId");
  const langRaw = formData.get("lang");
  const stopId = typeof stopIdRaw === "string" ? Number(stopIdRaw) : NaN;
  const lang: Lang | null = langRaw === "vi" || langRaw === "en" ? (langRaw as Lang) : null;

  if (!Number.isInteger(stopId) || stopId < 1 || !lang) {
    return NextResponse.json({ message: "Missing valid stopId/lang" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ message: "File quá lớn (max 50 MB)" }, { status: 400 });
  }

  const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "m4a";
  const ext = ["mp3", "m4a", "ogg", "wav"].includes(rawExt) ? rawExt : "m4a";
  const sanitized = `stop${stopId}_${lang}_${Date.now()}.${ext}`
    .replace(/[^a-zA-Z0-9_\-.]/g, "")
    .toLowerCase();

  const buffer = Buffer.from(await file.arrayBuffer());
  let publicPath: string;

  if (IS_VERCEL) {
    const blob = await put(`audio/${sanitized}`, buffer, {
      access: "public",
      contentType: file.type || `audio/${ext}`,
      allowOverwrite: true,
    });
    publicPath = blob.url;
  } else {
    await fs.mkdir(AUDIO_DIR, { recursive: true });
    await fs.writeFile(path.join(AUDIO_DIR, sanitized), buffer);
    publicPath = `/audio/${sanitized}`;
  }

  const current = await getStop(stopId);
  if (!current) return NextResponse.json({ message: `Stop ${stopId} not found` }, { status: 404 });

  const updated = await updateStop(stopId, {
    audio: { ...current.audio, [lang]: publicPath },
  });

  return NextResponse.json({ ok: true, path: publicPath, stop: updated });
}
