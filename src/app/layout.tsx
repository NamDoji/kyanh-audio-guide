import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Merriweather } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PreferenceProvider } from "@/components/PreferenceProvider";
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
    default: "Ky Anh Underground Tunnel Audio Guide",
    template: "%s | Ky Anh Audio Guide",
  },
  description:
    "Mobile-first bilingual audio guide for the Ky Anh Underground Tunnels, with QR stops, route map, audio player, admin content editing and visitor feedback.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <PreferenceProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <BottomNav />
        </PreferenceProvider>
      </body>
    </html>
  );
}
