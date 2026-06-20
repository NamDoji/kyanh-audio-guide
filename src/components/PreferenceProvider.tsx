"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "@/types/content";

type PreferenceContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  tunnelMode: boolean;
  setTunnelMode: (value: boolean) => void;
  fontScale: number;
  increaseFont: () => void;
  decreaseFont: () => void;
};

const PreferenceContext = createContext<PreferenceContextValue | null>(null);

export function PreferenceProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "vi";
    const savedLang = window.localStorage.getItem("kyanh_lang");
    return savedLang === "vi" || savedLang === "en" ? savedLang : "vi";
  });
  const [tunnelMode, setTunnelModeState] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("kyanh_tunnel_mode") === "true";
  });
  const [fontScale, setFontScale] = useState(() => {
    if (typeof window === "undefined") return 1;
    return Number(window.localStorage.getItem("kyanh_font_scale")) || 1;
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.theme = tunnelMode ? "tunnel" : "day";
    document.documentElement.style.setProperty("--font-scale", String(fontScale));
  }, [lang, tunnelMode, fontScale]);

  const value = useMemo<PreferenceContextValue>(
    () => ({
      lang,
      setLang: (nextLang) => {
        setLangState(nextLang);
        window.localStorage.setItem("kyanh_lang", nextLang);
      },
      tunnelMode,
      setTunnelMode: (value) => {
        setTunnelModeState(value);
        window.localStorage.setItem("kyanh_tunnel_mode", String(value));
      },
      fontScale,
      increaseFont: () =>
        setFontScale((current) => {
          const next = Math.min(1.25, Number((current + 0.08).toFixed(2)));
          window.localStorage.setItem("kyanh_font_scale", String(next));
          return next;
        }),
      decreaseFont: () =>
        setFontScale((current) => {
          const next = Math.max(0.92, Number((current - 0.08).toFixed(2)));
          window.localStorage.setItem("kyanh_font_scale", String(next));
          return next;
        }),
    }),
    [fontScale, lang, tunnelMode],
  );

  return <PreferenceContext.Provider value={value}>{children}</PreferenceContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferenceContext);
  if (!context) {
    throw new Error("usePreferences must be used inside PreferenceProvider");
  }
  return context;
}
