// Генерация favicon + telegram avatar из SVG → PNG.
// Монограмма "V" в стиле сайта: lime→cyan градиент на тёмном фоне.
// Запуск: node scripts/make-icons.mjs
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const require = createRequire(import.meta.url);

// SVG-источник монограммы. Квадрат 512×512, viewBox позволяет масштаб.
const svg512 = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="vg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a3e635"/>
      <stop offset="50%" stop-color="#4ade80"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#a3e635" stop-opacity="0.18"/>
      <stop offset="70%" stop-color="#a3e635" stop-opacity="0"/>
    </radialGradient>
    <filter id="softglow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- Фон -->
  <rect width="512" height="512" fill="#0b0e14"/>
  <!-- Лёгкое свечение -->
  <rect width="512" height="512" fill="url(#glow)"/>
  <!-- Тонкая сетка (как на сайте) -->
  <g stroke="#ffffff" stroke-opacity="0.04" stroke-width="1">
    ${Array.from({length: 9}, (_, i) => `<line x1="${(i+1)*51.2}" y1="0" x2="${(i+1)*51.2}" y2="512"/>`).join("")}
    ${Array.from({length: 9}, (_, i) => `<line x1="0" y1="${(i+1)*51.2}" x2="512" y2="${(i+1)*51.2}"/>`).join("")}
  </g>
  <!-- Буква V (жирная, геометричная) со свечением -->
  <g filter="url(#softglow)">
    <path d="M150 150 L256 380 L362 150 L320 150 L256 290 L192 150 Z" fill="url(#vg)"/>
  </g>
  <!-- Точка-акцент (как "." в Vitaliy.dev) -->
  <circle cx="345" cy="160" r="14" fill="#71717a"/>
</svg>`;

// Квадратная версия для Telegram-аватарки (512) и favicon (512, потом уменьшим).
const sizes = [
  { name: "avatar-telegram.png", size: 512 },
  { name: "favicon-512.png", size: 512 },
  { name: "favicon-32.png", size: 32 },
  { name: "favicon-16.png", size: 16 },
];

// Конвертация SVG → PNG. Пробуем sharp (если установлен), иначе ImageMagick.
async function svgToPng(svg, size, outPath) {
  const svgPath = path.join(root, "scripts", `_tmp-${size}.svg`);
  fs.writeFileSync(svgPath, svg(size));

  // sharp — самый надёжный путь
  try {
    const sharp = require("sharp");
    await sharp(svgPath).resize(size, size).png().toFile(outPath);
    fs.unlinkSync(svgPath);
    return true;
  } catch {
    // sharp нет — пробуем ImageMagick
    try {
      execSync(`magick -background none -density 300 "${svgPath}" -resize ${size}x${size} "${outPath}"`, { stdio: "ignore" });
      fs.unlinkSync(svgPath);
      return true;
    } catch {
      // нет ни sharp, ни magick
      fs.unlinkSync(svgPath);
      return false;
    }
  }
}

// Apple Touch Icon (180, без прозрачности, со своим фоном)
const sizesApple = [{ name: "apple-touch-icon.png", size: 180 }];

async function main() {
  console.log("Генерация иконок из SVG...");
  let okCount = 0;
  for (const { name, size } of [...sizes, ...sizesApple]) {
    const out = path.join(publicDir, name);
    const ok = await svgToPng(svg512, size, out);
    if (ok) {
      const stat = fs.statSync(out);
      console.log(`  ✓ ${name} (${size}×${size}, ${(stat.size / 1024).toFixed(1)} KB)`);
      okCount++;
    } else {
      console.log(`  ✗ ${name} — нет sharp/magick для конвертации`);
    }
  }

  // Также сохраним master SVG (полезно для будущего)
  fs.writeFileSync(path.join(publicDir, "icon.svg"), svg512(512));
  console.log(`  ✓ icon.svg (мастер)`);

  if (okCount === 0) {
    console.log("\n⚠ Не найдено sharp или ImageMagick. Устанавливаю sharp...");
    console.log("Запусти: npm i -D sharp && node scripts/make-icons.mjs");
    process.exitCode = 1;
  } else {
    console.log(`\nГотово: ${okCount} PNG + 1 SVG в public/`);
  }
}

main();
