import localFont from "next/font/local";

// Локальные шрифты из public/fonts/ — без внешних запросов к Google Fonts
// (заблокирован в РФ). Next.js оптимизирует и инлайнит автоматически.
const manrope = localFont({
  src: [
    { path: "../public/fonts/manrope-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/manrope-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/manrope-600.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/manrope-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-manrope",
  display: "block",
});

const unbounded = localFont({
  src: [
    { path: "../public/fonts/unbounded-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/unbounded-600.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/unbounded-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-unbounded",
  display: "block",
});

const jetbrainsMono = localFont({
  src: [
    { path: "../public/fonts/jetbrains-mono-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/jetbrains-mono-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-jetbrains-mono",
  display: "block",
});

export const fonts = `${manrope.variable} ${unbounded.variable} ${jetbrainsMono.variable}`;
