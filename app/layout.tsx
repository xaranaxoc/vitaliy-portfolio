import type { Metadata } from "next";
import "./globals.css";
import { fonts } from "./fonts";
import { profile } from "@/lib/data";

export const metadata: Metadata = {
  title: `${profile.nameRu} — сайты, которые приносят клиентов`,
  description:
    "Сайты, которые приносят клиентов. Создаю лендинги, интернет-магазины и ботов под ключ — от идеи до запуска. Заявки, продажи и автоматизация 24/7.",
  keywords: [
    "создание сайтов",
    "лендинг",
    "интернет-магазин",
    "разработчик",
    "React",
    "Next.js",
    "Telegram-боты",
  ],
  authors: [{ name: profile.nameRu }],
  alternates: { canonical: "https://matveev-devs.ru/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://matveev-devs.ru/",
    siteName: `${profile.nameRu} — разработка сайтов под ключ`,
    title: `${profile.nameRu} — сайты, которые приносят клиентов`,
    description:
      "Лендинги, интернет-магазины и боты под ключ. От идеи до запуска — заявки и продажи 24/7.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${profile.nameRu} — сайты, которые приносят клиентов`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.nameRu} — сайты, которые приносят клиентов`,
    description:
      "Лендинги, интернет-магазины и боты под ключ. От идеи до запуска — заявки и продажи 24/7.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={fonts} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
