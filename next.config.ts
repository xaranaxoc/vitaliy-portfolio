import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Автономная сборка для VPS: .next/standalone + .next/static.
  // Запускается через node server.js без полного node_modules.
  output: "standalone",
  // Фикс: без этого Next определяет workspace root по внешнему package-lock.json
  // (в C:\Users\bu4ukeec) и кладёт standalone во вложенную структуру путей.
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
