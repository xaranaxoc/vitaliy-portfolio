import type { Metadata } from "next";
import "./globals.css";
import { fonts } from "./fonts";
import { profile } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL("https://matveev-devs.ru"),
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
    title: "Клиенты уходят к конкурентам?",
    description:
      "Сайт, который перехватывает их: заявки, оплаты и запись — 24/7, без вашего участия. Лендинг от 5 000 ₽, магазин от 15 000 ₽.",
    images: [
      {
        url: "https://vitaliy-portfolio-one.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vitaliy.dev — сайты, которые приносят клиентов",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Клиенты уходят к конкурентам?",
    description:
      "Сайт, который перехватывает их: заявки, оплаты и запись — 24/7, без вашего участия. Лендинг от 5 000 ₽, магазин от 15 000 ₽.",
    images: ["https://vitaliy-portfolio-one.vercel.app/og-image.png"],
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

// Structured data для rich snippets в Google (ProfessionalService schema).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: `${profile.nameRu} — разработка сайтов под ключ`,
  description:
    "Создаю лендинги, интернет-магазины и ботов под ключ. Сайт, который приносит клиентов: заявки, продажи и автоматизация 24/7.",
  email: profile.email,
  areaServed: "RU",
  knowsAbout: [
    "Лендинги",
    "Интернет-магазины",
    "Telegram-боты",
    "React",
    "Next.js",
    "Python",
    "FastAPI",
  ],
  sameAs: [profile.github, profile.telegram],
  url: "https://matveev-devs.ru",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={fonts} suppressHydrationWarning>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
