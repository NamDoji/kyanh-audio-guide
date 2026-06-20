import { promises as fs } from "fs";
import path from "path";
import type { FeedbackPayload, NewsPost, SiteContent, Stop, VisitPayload, VisitRecord } from "@/types/content";

const dataDir = path.join(process.cwd(), "data");
const stopsPath = path.join(dataDir, "stops.json");
const feedbackPath = path.join(dataDir, "feedback.jsonl");
const visitsPath = path.join(dataDir, "visits.jsonl");

const defaultNews: NewsPost[] = [
  {
    id: 1,
    slug: "welcome-to-ky-anh-audio-guide",
    title: {
      vi: "Ra mắt audio guide Địa đạo Kỳ Anh",
      en: "Ky Anh audio guide is now available",
    },
    excerpt: {
      vi: "Khách tham quan có thể quét QR tại từng điểm để nghe thuyết minh song ngữ và xem bản đồ tuyến.",
      en: "Visitors can scan QR codes at each stop to listen to bilingual narration and view the route map.",
    },
    body: {
      vi: "Hệ thống audio guide hỗ trợ khách tự tham quan Địa đạo Kỳ Anh bằng điện thoại cá nhân. Mỗi điểm dừng có audio, tóm tắt, bản đồ và nội dung song ngữ Việt - Anh.",
      en: "The audio guide helps visitors explore the Ky Anh tunnels on their own phones. Each stop includes audio, summaries, map access and bilingual Vietnamese - English content.",
    },
    image: "/images/heritage.svg",
    publishedAt: new Date().toISOString(),
    status: "published",
  },
];

function withDefaults(content: SiteContent): SiteContent {
  return {
    ...content,
    news: Array.isArray(content.news) ? content.news : defaultNews,
  };
}

export async function getContent(): Promise<SiteContent> {
  const raw = await fs.readFile(stopsPath, "utf8");
  return withDefaults(JSON.parse(raw) as SiteContent);
}

export async function saveContent(content: SiteContent): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(stopsPath, `${JSON.stringify(withDefaults(content), null, 2)}\n`, "utf8");
}

export async function getStops(): Promise<Stop[]> {
  const content = await getContent();
  return content.stops.sort((a, b) => a.id - b.id);
}

export async function getStop(id: number): Promise<Stop | undefined> {
  const stops = await getStops();
  return stops.find((stop) => stop.id === id);
}

export async function updateStop(id: number, patch: Partial<Stop>): Promise<Stop> {
  const content = await getContent();
  const index = content.stops.findIndex((stop) => stop.id === id);

  if (index < 0) {
    throw new Error(`Stop ${id} was not found`);
  }

  const updated = {
    ...content.stops[index],
    ...patch,
    id,
  };

  content.stops[index] = updated;
  await saveContent(content);
  return updated;
}

export async function getNewsPosts(includeDrafts = false): Promise<NewsPost[]> {
  const content = await getContent();
  return content.news
    .filter((post) => includeDrafts || post.status === "published")
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getNewsPost(id: number): Promise<NewsPost | undefined> {
  const content = await getContent();
  return content.news.find((post) => post.id === id);
}

export async function upsertNewsPost(payload: Partial<NewsPost>): Promise<NewsPost> {
  const content = await getContent();
  const existingIndex = payload.id ? content.news.findIndex((post) => post.id === payload.id) : -1;
  const maxId = content.news.reduce((max, post) => Math.max(max, post.id), 0);
  const id = existingIndex >= 0 ? content.news[existingIndex].id : maxId + 1;
  const fallbackSlug = `news-${id}`;
  const existing = existingIndex >= 0 ? content.news[existingIndex] : undefined;
  const post: NewsPost = {
    id,
    slug: payload.slug || existing?.slug || fallbackSlug,
    title: payload.title || existing?.title || { vi: `Tin tức ${id}`, en: `News ${id}` },
    excerpt: payload.excerpt || existing?.excerpt || { vi: "", en: "" },
    body: payload.body || existing?.body || { vi: "", en: "" },
    image: payload.image || existing?.image || "/images/heritage.svg",
    publishedAt: payload.publishedAt || existing?.publishedAt || new Date().toISOString(),
    status: payload.status || existing?.status || "draft",
  };

  if (existingIndex >= 0) content.news[existingIndex] = post;
  else content.news.push(post);

  await saveContent(content);
  return post;
}

export async function deleteNewsPost(id: number): Promise<void> {
  const content = await getContent();
  content.news = content.news.filter((post) => post.id !== id);
  await saveContent(content);
}

export async function appendFeedback(payload: FeedbackPayload): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });
  const record = {
    ...payload,
    createdAt: new Date().toISOString(),
  };
  await fs.appendFile(feedbackPath, `${JSON.stringify(record)}\n`, "utf8");
}

async function readJsonLines<T>(filePath: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as T);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function getFeedbackRecords() {
  return readJsonLines<FeedbackPayload & { createdAt: string }>(feedbackPath);
}

export async function appendVisit(payload: VisitPayload, request: Request): Promise<void> {
  if (!payload.path || payload.path.startsWith("/api") || payload.path.startsWith("/_next")) return;

  await fs.mkdir(dataDir, { recursive: true });
  const record: VisitRecord = {
    ...payload,
    createdAt: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") ?? undefined,
    ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
  };
  await fs.appendFile(visitsPath, `${JSON.stringify(record)}\n`, "utf8");
}

export async function getVisitRecords(): Promise<VisitRecord[]> {
  return readJsonLines<VisitRecord>(visitsPath);
}

export function absoluteUrl(pathname: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return new URL(pathname, base).toString();
}
