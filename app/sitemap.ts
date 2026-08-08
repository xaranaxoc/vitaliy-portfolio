import type { MetadataRoute } from "next";

// sitemap.xml — карта сайта для поисковых роботов.
// Только публичные статичные страницы. /admin, /pay/* — приватные/dynamic.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://matveev-devs.ru";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/oferta`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/consent`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
