import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import localFont from "next/font/local";
import "./globals.css";
import KakaoMapInitializer from "@/components/KakaoMapInitializer";
import Navigation from './components/navigation'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '맵맵 - 우리 동네 전문가',
  description: '우리 동네 전문가를 찾아보세요',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}
      >
        <KakaoMapInitializer />
        {children}
        <Navigation />
      </body>
    </html>
  );
}
