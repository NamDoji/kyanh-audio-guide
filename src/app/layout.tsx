import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Merriweather } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { PreferenceProvider } from "@/components/PreferenceProvider";
import { getContent } from "@/lib/content";
import "./globals.css";

const sans = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const serif = Merriweather({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Địa đạo Kỳ Anh Audio Guide",
    template: "%s | Địa đạo Kỳ Anh Audio Guide",
  },
  description:
    "Thuyết minh tự động song ngữ Việt–Anh cho Di tích Địa đạo Kỳ Anh. Quét QR tại từng điểm để nghe câu chuyện lịch sử tại chỗ.",
  openGraph: {
    title: "Địa đạo Kỳ Anh Audio Guide",
    description: "Hành trình lắng nghe lịch sử dưới lòng đất xứ Quảng.",
    images: ["/images/tunnel-entrance.svg"],
    locale: "vi_VN",
    alternateLocale: ["en_US"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#006c80",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getContent();
  return (
    <html lang="vi" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <PreferenceProvider>
          <AnalyticsTracker />
          <Header />
          <main>{children}</main>
          <Footer contact={content.contact} />
          <BottomNav />
        </PreferenceProvider>
      </body>
    </html>
  );
}
