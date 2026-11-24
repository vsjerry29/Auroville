const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const screenshotDir = path.join(__dirname, '..', 'docs', 'v5', 'screenshots', 'storyboard_ch01_ch02');
fs.mkdirSync(screenshotDir, { recursive: true });

async function verifyStoryboard() {
  console.log('Launching browser for Chapters 01 & 02 Storyboard Verification...');
  const browser = await chromium.launch({ channel: 'msedge' });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Wait for React hydration and 550vh scroll track
  await page.waitForFunction(() => document.documentElement.scrollHeight > window.innerHeight + 1000);
  await page.waitForTimeout(1000);

  const maxScroll = await page.evaluate(() => {
    return document.documentElement.scrollHeight - window.innerHeight;
  });

  console.log(`Document max scroll distance: ${maxScroll}px`);

  // 1. Frame 01: CH01 — Initial Hero (0% scroll)
  console.log('Capturing Frame 01: Initial Hero...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotDir, '01-ch01-initial-hero.png') });

  // 1b. Test Pointer Proximity in Hero (Banyan & Potter)
  console.log('Testing Hero Pointer Proximity...');
  await page.mouse.move(250, 600); // near potter
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(screenshotDir, '01b-ch01-potter-swirl-interaction.png') });

  await page.mouse.move(1100, 450); // near banyan
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(screenshotDir, '01c-ch01-banyan-hover-interaction.png') });

  // 2. Frame 02: CH01 — Typography Moving Aside (20% of maxScroll = ~0.044 global, ~20% local CH01)
  console.log('Capturing Frame 02: Typography Moving Aside...');
  await page.evaluate((y) => window.scrollTo(0, y), 0.08 * maxScroll);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotDir, '02-ch01-typography-moving-aside.png') });

  // 3. Frame 03: CH01/CH02 — Shared Architectural Transition (around 23.2% global scroll = fold ~50% open)
  console.log('Capturing Frame 03: Shared Architectural Transition / Paper Edge (midway)...');
  await page.evaluate((y) => window.scrollTo(0, y), 0.232 * maxScroll);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotDir, '03-ch01-ch02-shared-architectural-transition.png') });

  // 3b. Frame 03b: CH01/CH02 — Paper Edge at 80% Reveal
  await page.evaluate((y) => window.scrollTo(0, y), 0.245 * maxScroll);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotDir, '03b-ch01-ch02-fold-80-percent.png') });

  // 4. Frame 04: CH02 — Landscape Fully Revealed (around 30% - 35% global scroll)
  console.log('Capturing Frame 04: Landscape Fully Revealed...');
  await page.evaluate((y) => window.scrollTo(0, y), 0.32 * maxScroll);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotDir, '04-ch02-landscape-fully-revealed.png') });

  // 5. Frame 05: CH02 — Interactive Landscape Composition
  console.log('Capturing Frame 05: Interactive Landscape Discoveries...');
  await page.evaluate((y) => window.scrollTo(0, y), 0.36 * maxScroll);
  await page.waitForTimeout(400);

  // Click the Matrimandir dome to activate geometric discovery
  const domeArea = await page.$('div[aria-label="Inspect Matrimandir Geodesic Dome"]');
  if (domeArea) {
    await domeArea.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, '05-ch02-interactive-dome-discovery.png') });
    const closeBtn = await page.$('button[aria-label="Close discovery"]');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(200);
  }

  // Click foreground botanical leaves
  const foliageArea = await page.$('div[aria-label="Inspect Indigenous Forest Foliage"]');
  if (foliageArea) {
    await foliageArea.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, '05b-ch02-interactive-botanical-discovery.png') });
    const closeBtn = await page.$('button[aria-label="Close discovery"]');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(200);
  }

  // 6. Frame 06: CH02 — Final Transition toward CH03 (around 44% - 46% global scroll)
  console.log('Capturing Frame 06: Final Transition toward CH03...');
  await page.evaluate((y) => window.scrollTo(0, y), 0.44 * maxScroll);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotDir, '06-ch02-final-transition-toward-ch03.png') });

  // 7. Verify Reverse Scroll Continuity
  console.log('Verifying reverse scroll from 44% back to 0%...');
  for (let s = 40; s >= 0; s -= 10) {
    await page.evaluate((y) => window.scrollTo(0, y), (s / 100) * maxScroll);
    await page.waitForTimeout(150);
  }
  await page.screenshot({ path: path.join(screenshotDir, '07-reverse-scroll-hero-reconstituted.png') });

  // 8. Mobile responsive check (390x844)
  console.log('Verifying mobile responsive layout (390x844)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const mobileMaxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  await page.screenshot({ path: path.join(screenshotDir, '08-mobile-ch01-hero.png') });

  await page.evaluate((y) => window.scrollTo(0, y), 0.32 * mobileMaxScroll);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotDir, '09-mobile-ch02-panorama.png') });

  await browser.close();
  console.log('Chapters 01 & 02 Storyboard Verification completed successfully!');
}

verifyStoryboard().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
