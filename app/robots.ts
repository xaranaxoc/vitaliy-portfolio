import type { MetadataRoute } from "next";

// robots.txt — разрешаем индексацию всего, указываем sitemap.
// Без этого файла Next отдаёт 404-страницу с meta noindex,
// что может заставить ботов думать, что сайт запрещён к индексации.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: "https://matveev-devs.ru/sitemap.xml",
    host: "https://matveev-devs.ru",
  };
}
