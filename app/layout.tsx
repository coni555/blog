import React from 'react';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from './components/Navbar';
import ClientThemeProvider from './providers/ThemeProvider';
import ScrollProgressBar from './components/ScrollProgressBar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "幻语 AI 创作馆",
  description: "探索AI写作与创作的可能性，分享AI时代的创作技巧与个人见解",
  keywords: "AI, 人工智能, 写作, 创作, 提问技巧, 自我提升, 思维培养, 博客",
  authors: [{ name: "coni", url: "https://yourdomain.com" }],
  creator: "coni",
  publisher: "幻语 AI 创作馆",
  openGraph: {
    title: "幻语 AI 创作馆 - AI写作与创作的个人博客",
    description: "探索AI写作与创作的可能性，分享AI时代的创作技巧与个人见解",
    url: "https://yourdomain.com",
    siteName: "幻语 AI 创作馆",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "幻语 AI 创作馆 - AI写作与创作的个人博客",
    description: "探索AI写作与创作的可能性，分享AI时代的创作技巧与个人见解",
    creator: "@yourhandle",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://yourdomain.com",
  },
  metadataBase: new URL("https://yourdomain.com"),
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen transition-colors duration-500`}
      >
        <ClientThemeProvider>
          <ScrollProgressBar />
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
