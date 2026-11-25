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
  // Always start with server-safe defaults to avoid hydration mismatch
  const [lang, setLangState] = useState<Lang>("vi");
  const [tunnelMode, setTunnelModeState] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [mounted, setMounted] = useState(false);

  // After mount: read localStorage and apply user preferences
  useEffect(() => {
    const savedLang = localStorage.getItem("kyanh_lang");
    if (savedLang === "vi" || savedLang === "en") setLangState(savedLang);

    const savedTunnel = localStorage.getItem("kyanh_tunnel_mode");
    if (savedTunnel === "true") setTunnelModeState(true);

    const savedScale = parseFloat(localStorage.getItem("kyanh_font_scale") || "1");
    if (!isNaN(savedScale) && savedScale >= 0.92 && savedScale <= 1.25) {
      setFontScale(savedScale);
    }

    setMounted(true);
  }, []);

  // Apply lang/theme/font to <html>
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = lang;
    document.documentElement.dataset.theme = tunnelMode ? "tunnel" : "day";
    document.documentElement.style.setProperty("--font-scale", String(fontScale));
  }, [lang, tunnelMode, fontScale, mounted]);

  const value = useMemo<PreferenceContextValue>(
    () => ({
      lang,
      setLang: (nextLang) => {
        setLangState(nextLang);
        localStorage.setItem("kyanh_lang", nextLang);
        document.documentElement.lang = nextLang;
      },
      tunnelMode,
      setTunnelMode: (val) => {
        setTunnelModeState(val);
        localStorage.setItem("kyanh_tunnel_mode", String(val));
        document.documentElement.dataset.theme = val ? "tunnel" : "day";
      },
      fontScale,
      increaseFont: () =>
        setFontScale((cur) => {
          const next = Math.min(1.25, parseFloat((cur + 0.08).toFixed(2)));
          localStorage.setItem("kyanh_font_scale", String(next));
          document.documentElement.style.setProperty("--font-scale", String(next));
          return next;
        }),
      decreaseFont: () =>
        setFontScale((cur) => {
          const next = Math.max(0.92, parseFloat((cur - 0.08).toFixed(2)));
          localStorage.setItem("kyanh_font_scale", String(next));
          document.documentElement.style.setProperty("--font-scale", String(next));
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
