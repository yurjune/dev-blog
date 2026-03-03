import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import ScrollToTopBtn from "@/components/ScrollToTop";
import { SITE_METADATA, TWITTER_CONFIG } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_METADATA.title, // title 이 누락된 페이지에 적용
    // 하위 페이지의 title과 병합
    // %s 자리에 하위 페이지의 title 삽입
    template: `%s | ${SITE_METADATA.title}`,
  },
  description: SITE_METADATA.description,
  authors: [{ name: SITE_METADATA.author }],
  keywords: [...SITE_METADATA.keywords],
  metadataBase: new URL(SITE_METADATA.baseUrl), // 상대경로 메타값을 절대경로로 바꿀 때 사용
  openGraph: {
    url: SITE_METADATA.baseUrl,
    type: "website",
    locale: SITE_METADATA.locale,
    siteName: SITE_METADATA.siteName,
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    images: [SITE_METADATA.ogImage],
  },
  twitter: {
    card: TWITTER_CONFIG.card,
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    images: [SITE_METADATA.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: SITE_METADATA.favicon,
    shortcut: SITE_METADATA.favicon,
    apple: SITE_METADATA.appleIcon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={geistSans.variable}>
      <body className="antialiased">
        <Header />
        <main className="min-h-screen mb-2">{children}</main>
        <Footer />

        <ScrollToTopBtn />
      </body>
    </html>
  );
}
