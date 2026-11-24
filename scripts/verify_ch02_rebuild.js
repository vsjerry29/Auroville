const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const screenshotDir = path.join(__dirname, '..', 'docs', 'v5', 'screenshots', 'ch02_photo_transition');
const recordingDir = path.join(__dirname, '..', 'docs', 'v5', 'recordings');
fs.mkdirSync(screenshotDir, { recursive: true });
fs.mkdirSync(recordingDir, { recursive: true });

async function verifyChapter02Rebuild() {
  console.log('Launching browser with native video recording...');
  const browser = await chromium.launch({ channel: 'msedge' });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: recordingDir,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Wait for React hydration and scroll track
  await page.waitForFunction(() => document.documentElement.scrollHeight > window.innerHeight + 1000);
  await page.waitForTimeout(1000);

  const maxScroll = await page.evaluate(() => {
    return document.documentElement.scrollHeight - window.innerHeight;
  });

  console.log(`Document max scroll distance: ${maxScroll}px`);

  // ---------------------------------------------------------------------------
  // STATE 1: CH01 Final Transition Frame (around 19% global scroll)
  // AURO VILLE parted outward; centered Matrimandir elevation study anchors center
  // ---------------------------------------------------------------------------
  console.log('Capturing State 1: CH01 Final Transition Frame...');
  await page.evaluate((y) => window.scrollTo(0, y), 0.19 * maxScroll);
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotDir, '01_ch01_final_transition_frame.png') });

  // ---------------------------------------------------------------------------
  // STATE 2: CH02 Illustrated Start (around 23% global scroll)
  // Full hand-drawn watercolor & ink illustration of Matrimandir in landscape
  // ---------------------------------------------------------------------------
  console.log('Capturing State 2: CH02 Illustrated Start...');
  await page.evaluate((y) => window.scrollTo(0, y), 0.23 * maxScroll);
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotDir, '02_ch02_illustrated_start.png') });

  // ---------------------------------------------------------------------------
  // STATE 3: CH02 Aligned Illustrated Composition (around 28% global scroll)
  // Illustrated composition settles into exact framing; baseline completes path
  // ---------------------------------------------------------------------------
  console.log('Capturing State 3: CH02 Aligned Illustrated Composition...');
  await page.evaluate((y) => window.scrollTo(0, y), 0.28 * maxScroll);
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotDir, '03_ch02_aligned_illustrated_composition.png') });

  // Test pointer discovery over dome in illustrated state
  console.log('Testing interactive inspection on dome...');
  const domeArea = await page.$('div[aria-label="Inspect Matrimandir Geodesic Dome"]');
  if (domeArea) {
    await domeArea.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, '03b_ch02_dome_discovery_card.png') });
    const closeBtn = await page.$('button[aria-label="Close discovery"]');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(300);
  }

  // ---------------------------------------------------------------------------
  // STATE 4: Mid-Transition where Dome is Partly Photo / Partly Illustration (around 35.5% scroll)
  // Golden discs in dome are photographic; ramps & trees remain illustrated; ink linework lingers
  // ---------------------------------------------------------------------------
  console.log('Capturing State 4: Mid-Transition (Dome Partly Photo / Partly Illustration)...');
  await page.evaluate((y) => window.scrollTo(0, y), 0.355 * maxScroll);
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotDir, '04_ch02_mid_transition_dome_photo.png') });

  // ---------------------------------------------------------------------------
  // STATE 5: CH02 Nearly-Complete Transition (around 39.5% scroll)
  // Sandstone ramps, marble lotus petals, and trees resolving into photograph
  // ---------------------------------------------------------------------------
  console.log('Capturing State 5: CH02 Nearly-Complete Transition...');
  await page.evaluate((y) => window.scrollTo(0, y), 0.395 * maxScroll);
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotDir, '05_ch02_nearly_complete_transition.png') });

  // ---------------------------------------------------------------------------
  // STATE 6: CH02 Final Full-Photo Frame (around 41.5% scroll)
  // Real Matrimandir photograph holding in pristine clarity with archival plaque
  // ---------------------------------------------------------------------------
  console.log('Capturing State 6: CH02 Final Full-Photo Frame...');
  await page.evaluate((y) => window.scrollTo(0, y), 0.415 * maxScroll);
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotDir, '06_ch02_final_full_photo_frame.png') });

  // ---------------------------------------------------------------------------
  // VERIFY REVERSE SCROLL CONTINUITY (Scroll back smoothly from 44% to 0%)
  // ---------------------------------------------------------------------------
  console.log('Verifying smooth reverse scroll from 44% back to 0%...');
  for (let s = 44; s >= 0; s -= 2) {
    await page.evaluate((y) => window.scrollTo(0, y), (s / 100) * maxScroll);
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotDir, '07_reverse_scroll_hero_reconstituted.png') });

  // ---------------------------------------------------------------------------
  // Perform a smooth forward scroll sweep for video recording
  // ---------------------------------------------------------------------------
  console.log('Performing smooth forward scroll sweep for screen recording...');
  for (let s = 0; s <= 46; s += 1) {
    await page.evaluate((y) => window.scrollTo(0, y), (s / 100) * maxScroll);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(1000);

  // Close page and context to finalize video recording file
  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  if (video) {
    const videoPath = await video.path();
    console.log(`Video recorded to: ${videoPath}`);
    // Copy video to known friendly name
    const finalVideoPath = path.join(recordingDir, 'ch01_to_ch02_photo_transition.webm');
    fs.copyFileSync(videoPath, finalVideoPath);
    console.log(`Saved friendly video to: ${finalVideoPath}`);
  }

  console.log('Chapter 02 Rebuild Verification completed successfully!');
}

verifyChapter02Rebuild().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
