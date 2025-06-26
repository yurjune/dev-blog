import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_METADATA, TWITTER_CONFIG } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_METADATA.title,
    template: `%s | ${SITE_METADATA.title}`,
  },
  description: SITE_METADATA.description,
  keywords: [...SITE_METADATA.keywords],
  authors: [{ name: SITE_METADATA.author }],
  creator: SITE_METADATA.author,
  publisher: SITE_METADATA.siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_METADATA.baseUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: SITE_METADATA.type,
    locale: SITE_METADATA.locale,
    title: SITE_METADATA.title,
    description: SITE_METADATA.shortDescription,
    siteName: SITE_METADATA.siteName,
    images: [SITE_METADATA.image],
  },
  twitter: {
    card: TWITTER_CONFIG.card,
    title: SITE_METADATA.title,
    description: SITE_METADATA.shortDescription,
    images: [SITE_METADATA.image],
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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen mb-2">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
