// Inline CSS в HTML, чтобы убрать FOUC (flash of unstyled content).
// Браузер получает стили вместе с HTML в первом ответе — никакого «голого текста».
// Запускается после prerender в build-команде.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distIndex = path.join(root, "dist", "index.html");

if (!fs.existsSync(distIndex)) {
  console.error("inline-css: dist/index.html не найден, пропуск");
  process.exitCode = 1;
  process.exit(0);
}

let html = fs.readFileSync(distIndex, "utf8");
let replaced = 0;

// Заменяем каждый <link rel="stylesheet" href="/...css"> на <style>содержимое</style>.
// Поддерживает crossorigin="" атрибут (Vite добавляет его для /assets/*).
html = html.replace(
  /<link\s+rel="stylesheet"[^>]*href="(\/[^"]+\.css)"[^>]*>/g,
  (match, href) => {
    const file = path.join(root, "dist", href);
    if (!fs.existsSync(file)) {
      console.warn(`inline-css: файл не найден ${href}, пропуск`);
      return match;
    }
    const css = fs.readFileSync(file, "utf8");
    replaced++;
    return `<style>\n${css}\n</style>`;
  },
);

fs.writeFileSync(distIndex, html);
console.log(`inline-css: встроено ${replaced} CSS-файл(ов) в index.html`);
