// SSG prerender: after `vite build`, serve dist/, render "/" in a headless
// browser, and overwrite dist/index.html with the fully-rendered DOM so
// crawlers/AI see real content instead of an empty #root shell.
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distIndex = path.join(root, "dist", "index.html");
const PORT = 4173;
const URL = `http://localhost:${PORT}/`;

async function waitForServer(url, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status < 500) return true;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  return false;
}

const preview = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["vite", "preview", "--port", String(PORT), "--strictPort"],
  { cwd: root, stdio: "ignore", shell: true },
);

try {
  const ready = await waitForServer(URL, 40000);
  if (!ready) {
    console.error("prerender: vite preview did not start in time");
    process.exitCode = 1;
    throw new Error("timeout");
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 30000 });
  // Portfolio hero headline proves the app rendered (not a loading shell).
  await page.waitForSelector("h1", { timeout: 20000 });
  await page.waitForTimeout(1000); // let fonts/CSS settle
  const html = await page.content();
  await browser.close();

  if (!html || html.length < 1000) {
    console.error("prerender: captured HTML too small, aborting");
    process.exitCode = 1;
  } else {
    fs.writeFileSync(distIndex, html);
    console.log(`prerender: wrote rendered HTML to dist/index.html (${(html.length / 1024).toFixed(1)} KB)`);
  }
} catch (err) {
  console.error("prerender failed:", err?.message || err);
  if (!process.exitCode) process.exitCode = 1;
} finally {
  preview.kill("SIGTERM");
}
