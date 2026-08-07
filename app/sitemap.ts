import type { MetadataRoute } from "next";

// sitemap.xml — карта сайта для поисковых роботов.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://matveev-devs.ru";
  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
