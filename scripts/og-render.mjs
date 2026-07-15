import { chromium } from "playwright";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(__dirname, "..");
const ogUrl = "file:///" + path.join(repo, "og.html").replace(/\\/g, "/");
const out = path.join(repo, "public", "og-image.png");

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
});
await page.goto(ogUrl, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();

console.log("OG written:", out);
