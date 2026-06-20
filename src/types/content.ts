export type Lang = "vi" | "en";

export type LocalizedText = {
  vi: string;
  en: string;
};

export type LocalizedList = {
  vi: string[];
  en: string[];
};

export type Stop = {
  id: number;
  slug: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  summary: LocalizedText;
  transcript: LocalizedText;
  location: LocalizedText;
  highlights: LocalizedList;
  reflection: LocalizedText;
  duration: string;
  image: string;
  audio: LocalizedText;
  qrPath: string;
  mapPosition: {
    x: number;
    y: number;
  };
};

export type NewsPost = {
  id: number;
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText;
  image: string;
  publishedAt: string;
  status: "draft" | "published";
};

export type SiteContent = {
  site: {
    name: LocalizedText;
    tagline: LocalizedText;
    description: LocalizedText;
  };
  stops: Stop[];
  news: NewsPost[];
};

export type FeedbackPayload = {
  name: string;
  contact?: string;
  nationality?: string;
  rating: number;
  message: string;
};

export type FeedbackRecord = FeedbackPayload & {
  id: string;
  createdAt: string;
};

export type VisitPayload = {
  path: string;
  title?: string;
  referrer?: string;
  lang?: Lang;
};

export type VisitRecord = VisitPayload & {
  createdAt: string;
  userAgent?: string;
  ip?: string;
};
