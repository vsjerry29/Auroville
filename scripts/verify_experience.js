const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const screenshotDir = path.join(__dirname, '..', 'docs', 'screenshots');
fs.mkdirSync(screenshotDir, { recursive: true });

async function runVerification() {
  console.log('Launching browser for V4 CH03/CH04 verification...');
  const browser = await chromium.launch({ channel: 'msedge' });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Desktop progress steps: 0% to 100%
  const steps = [0, 15, 25, 35, 48, 60, 70, 78, 86, 95, 100];
  const maxScroll = await page.evaluate(() => {
    return document.documentElement.scrollHeight - window.innerHeight;
  });

  console.log(`Document max scroll distance: ${maxScroll}px`);

  for (const step of steps) {
    const targetY = (step / 100) * maxScroll;
    console.log(`Scrolling to ${step}% (scrollY: ${Math.round(targetY)}px)...`);
    await page.evaluate((y) => window.scrollTo(0, y), targetY);
    await page.waitForTimeout(400);

    const filename = `desktop-${String(step).padStart(3, '0')}pct-1440x900.png`;
    await page.screenshot({ path: path.join(screenshotDir, filename) });
    console.log(`Captured ${filename}`);
  }

  // 2. Test Reverse Scrolling: from 100% back to 0%
  console.log('Testing reverse scrolling...');
  for (let step = 90; step >= 0; step -= 30) {
    const targetY = (step / 100) * maxScroll;
    await page.evaluate((y) => window.scrollTo(0, y), targetY);
    await page.waitForTimeout(300);
  }
  const reverseScreenshot = 'desktop-reverse-000pct.png';
  await page.screenshot({ path: path.join(screenshotDir, reverseScreenshot) });
  console.log(`Captured reverse verification: ${reverseScreenshot}`);

  // 3. Test Chapter Navigation Overlay
  console.log('Testing Chapter Navigation Directory...');
  const menuBtn = await page.$('button[aria-label="Open Chapter Directory"]');
  if (menuBtn) {
    await menuBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, 'interaction-chapter-navigation.png') });
    console.log('Captured interaction-chapter-navigation.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // 4. Test Chapter 02 Landmark Hotspot Interaction
  console.log('Testing Chapter 02 Landmark Hotspot Interaction...');
  await page.evaluate((y) => window.scrollTo(0, y), 0.35 * maxScroll);
  await page.waitForTimeout(500);

  const domeHotspot = await page.$('button[aria-label="Inspect Matrimandir Sphere Landmark"]');
  if (domeHotspot) {
    await domeHotspot.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, 'interaction-ch02-landmark-hotspot.png') });
    console.log('Captured interaction-ch02-landmark-hotspot.png');

    const closeBtn = await page.$('button[aria-label="Close landmark study"]');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(300);
  }

  // 5. Test Chapter 03 Layer Comparison Toggle & Structural Callout
  console.log('Testing Chapter 03 State C Callout...');
  await page.evaluate((y) => window.scrollTo(0, y), 0.68 * maxScroll);
  await page.waitForTimeout(500);

  const calloutBtn = await page.$('button:has-text("1,415 GILDED DISCS")');
  if (calloutBtn) {
    await calloutBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, 'interaction-ch03-structural-callout.png') });
    console.log('Captured interaction-ch03-structural-callout.png');
    const closeSpecBtn = await page.$('button[aria-label="Close specification"]');
    if (closeSpecBtn) {
      await closeSpecBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(300);
  }

  // 6. Test Chapter 04 Suspended Print Modal (Click on PLATE 04-B)
  console.log('Testing Chapter 04 Suspended Print Modal...');
  await page.evaluate((y) => window.scrollTo(0, y), 0.78 * maxScroll);
  await page.waitForTimeout(500);

  const seedPrintCard = await page.$('div[aria-label*="PLATE 04-B"]');
  if (seedPrintCard) {
    await seedPrintCard.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, 'interaction-ch04-print-focus-modal.png') });
    console.log('Captured interaction-ch04-print-focus-modal.png');
    const closePrintBtn = await page.$('button[aria-label="Close print inspection"]');
    if (closePrintBtn) {
      await closePrintBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(300);
  }

  // 7. Test Chapter 04 Landscape Expansion & Seed Planting
  console.log('Testing Chapter 04 Seed Planting in Landscape Expansion...');
  await page.evaluate((y) => window.scrollTo(0, y), 0.98 * maxScroll);
  await page.waitForTimeout(500);

  // Click three spots on the red earth landscape to plant seeds
  await page.mouse.click(450, 450);
  await page.waitForTimeout(200);
  await page.mouse.click(700, 500);
  await page.waitForTimeout(200);
  await page.mouse.click(950, 480);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotDir, 'interaction-ch04-planted-seeds.png') });
  console.log('Captured interaction-ch04-planted-seeds.png');

  // 8. Responsive Viewports:
  const responsiveViewports = [
    { name: 'laptop-1280x800', width: 1280, height: 800 },
    { name: 'tablet-768x1024', width: 768, height: 1024 },
    { name: 'mobile-390x844', width: 390, height: 844 },
  ];

  for (const vp of responsiveViewports) {
    console.log(`Testing viewport ${vp.name}...`);
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);

    // Hero cover
    await page.screenshot({ path: path.join(screenshotDir, `responsive-${vp.name}-cover.png`) });

    const vpMaxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);

    // Chapter 02 Panorama
    await page.evaluate((y) => window.scrollTo(0, y), 0.35 * vpMaxScroll);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, `responsive-${vp.name}-ch02-panorama.png`) });

    // Scene 03 Lateral Track
    await page.evaluate((y) => window.scrollTo(0, y), 0.60 * vpMaxScroll);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, `responsive-${vp.name}-ch03-lateral.png`) });

    // Scene 04 Suspended Prints
    await page.evaluate((y) => window.scrollTo(0, y), 0.78 * vpMaxScroll);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, `responsive-${vp.name}-ch04-prints.png`) });
    console.log(`Captured responsive views for ${vp.name}`);
  }

  await browser.close();
  console.log('V4 CH03/CH04 Verification suite completed successfully!');
}

runVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
