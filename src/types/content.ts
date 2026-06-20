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

export type SiteContent = {
  site: {
    name: LocalizedText;
    tagline: LocalizedText;
    description: LocalizedText;
  };
  stops: Stop[];
};

export type FeedbackPayload = {
  name: string;
  contact?: string;
  nationality?: string;
  rating: number;
  message: string;
};
