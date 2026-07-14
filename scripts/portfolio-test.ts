/**
 * E2E test for the public portfolio page (no auth — app runs in public mode).
 * Run: bun run test scripts/portfolio-test.ts
 */
import { chromium } from "playwright";

const APP_URL = process.env.APP_URL ?? "http://localhost:4173";

async function main() {
  console.log(`\n🧪 Portfolio page test @ ${APP_URL}\n`);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    await page.goto(APP_URL, { waitUntil: "networkidle" });

    // Title
    const title = await page.title();
    if (!title.includes("Fullstack")) {
      throw new Error(`Unexpected title: ${title}`);
    }
    console.log(`✓ title: ${title}`);

    // Hero headline
    const h1 = await page.locator("h1").innerText();
    if (!h1.includes("Сайты, боты и API")) {
      throw new Error(`Hero headline missing, got: ${h1}`);
    }
    console.log("✓ hero headline visible");

    // Terminal typing animation progresses
    await page.waitForTimeout(3500);
    const termText = await page.locator("text=zsh").first().isVisible();
    const typed = await page
      .locator("text=ssh vitaliy@production")
      .first()
      .isVisible()
      .catch(() => false);
    if (!termText || !typed) {
      throw new Error(`Terminal not animating (chrome=${termText}, typed=${typed})`);
    }
    console.log("✓ terminal animation running");

    // All sections present
    for (const id of ["services", "work", "process", "stack", "contact"]) {
      const count = await page.locator(`#${id}`).count();
      if (count !== 1) throw new Error(`Section #${id} missing`);
    }
    console.log("✓ all 5 sections present");

    // 4 project cards
    const cards = await page.locator("#work article").count();
    if (cards !== 4) throw new Error(`Expected 4 project cards, got ${cards}`);
    console.log("✓ 4 project cards rendered");

    // 3 project screenshots actually load (naturalWidth > 0)
    const imgs = page.locator("#work article img");
    const imgCount = await imgs.count();
    if (imgCount !== 3) throw new Error(`Expected 3 project images, got ${imgCount}`);
    for (let i = 0; i < imgCount; i++) {
      const ok = await imgs.nth(i).evaluate(el => (el as HTMLImageElement).naturalWidth > 0);
      if (!ok) throw new Error(`Project image #${i} failed to load`);
    }
    console.log("✓ 3 project screenshots load");

    // Real contacts wired in
    const tgHref = await page.locator('#contact a[href*="t.me"]').getAttribute("href");
    if (tgHref !== "https://t.me/xarana_xoc") throw new Error(`Wrong TG link: ${tgHref}`);
    const ghCount = await page.locator('a[href="https://github.com/xaranaxoc"]').count();
    if (ghCount < 1) throw new Error("GitHub link missing");
    console.log("✓ real contacts (Telegram, GitHub) present");

    // Scroll through to trigger reveal animations, then verify visibility
    await page.evaluate(async () => {
      const step = window.innerHeight / 2;
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise(r => setTimeout(r, 150));
      }
    });
    await page.waitForTimeout(1500);
    const hidden = await page.locator(".pf-reveal:not(.pf-visible)").count();
    if (hidden > 0) throw new Error(`${hidden} reveal blocks never became visible`);
    console.log("✓ scroll-reveal animations fired for every block");

    // Contact CTA visible at bottom
    const cta = await page.locator("#contact >> text=Написать в Telegram").isVisible();
    if (!cta) throw new Error("Contact CTA not visible");
    console.log("✓ contact CTA visible");

    // Screenshots (desktop full page + mobile)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(800);

    // Verify gradient headline is actually clipped to text (not a solid bar)
    const clip = await page
      .locator("h1 span")
      .first()
      .evaluate(el => getComputedStyle(el).webkitBackgroundClip || getComputedStyle(el).backgroundClip);
    if (clip !== "text") throw new Error(`Gradient text not clipped: ${clip}`);
    console.log("✓ gradient headline clipped to text");
    await page.screenshot({ path: "/tmp/portfolio-hero.png" });
    await page.screenshot({ path: "/tmp/portfolio-full.png", fullPage: true });

    // Theme toggle: dark -> light, persists after reload
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    await page.locator('button[aria-label="Включить светлую тему"]').click();
    await page.waitForTimeout(500);
    const isLight = await page.evaluate(() => document.documentElement.classList.contains("pf-light"));
    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    if (!isLight || lightBg === darkBg) {
      throw new Error(`Theme toggle failed (class=${isLight}, bg ${darkBg} -> ${lightBg})`);
    }
    console.log("✓ light theme toggles");
    await page.screenshot({ path: "/tmp/portfolio-hero-light.png" });
    await page.screenshot({ path: "/tmp/portfolio-full-light.png", fullPage: true });
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const stillLight = await page.evaluate(() => document.documentElement.classList.contains("pf-light"));
    if (!stillLight) throw new Error("Theme choice not persisted after reload");
    console.log("✓ theme persists after reload");
    // back to dark for a clean state
    await page.locator('button[aria-label="Включить тёмную тему"]').click();

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobile.goto(APP_URL, { waitUntil: "networkidle" });
    await mobile.waitForTimeout(2500);
    const mobileH1 = await mobile.locator("h1").isVisible();
    if (!mobileH1) throw new Error("Hero not visible on mobile");
    console.log("✓ mobile hero visible");
    await mobile.screenshot({ path: "/tmp/portfolio-mobile.png" });
    await mobile.close();

    console.log("\n✅ Portfolio test PASSED\n");
  } catch (err) {
    await page.screenshot({ path: "/tmp/portfolio-error.png", fullPage: true });
    console.error("\n❌ Portfolio test FAILED:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
