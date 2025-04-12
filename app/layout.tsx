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
  title: "小夜 AI 创作馆",
  description: "AI 写作与创作的个人博客",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
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
