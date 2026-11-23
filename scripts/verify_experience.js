const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const screenshotDir = path.join(__dirname, '..', 'docs', 'screenshots');
fs.mkdirSync(screenshotDir, { recursive: true });

async function runVerification() {
  console.log('Launching browser for V3 verification...');
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
  const steps = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
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

  // 5. Test Chapter 03 Layer Comparison Slider Drag (Interaction I023)
  console.log('Testing Chapter 03 Layer Comparison Slider Drag...');
  await page.evaluate((y) => window.scrollTo(0, y), 0.52 * maxScroll);
  await page.waitForTimeout(500);

  const comparisonRegion = await page.$('[role="region"][aria-label^="Interactive architectural drawing comparison"]');
  if (comparisonRegion) {
    const box = await comparisonRegion.boundingBox();
    if (box) {
      // Drag divider handle from 50% to 25% to reveal more of shaded state
      await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.28, box.y + box.height * 0.5, { steps: 8 });
      await page.mouse.up();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(screenshotDir, 'interaction-ch03-layer-comparison.png') });
      console.log('Captured interaction-ch03-layer-comparison.png');
    }
  }

  // 6. Test Chapter 03 Structural Callout Modal (Interaction I024)
  console.log('Testing Chapter 03 Structural Callout Modal...');
  const calloutBtn = await page.$('button:has-text("1,415 ACOUSTIC DISCS")');
  if (calloutBtn) {
    await calloutBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, 'interaction-ch03-structural-callout.png') });
    console.log('Captured interaction-ch03-structural-callout.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // 7. Test Scene 04 Click-to-Focus Modal
  console.log('Testing Scene 04 Click-to-Focus Modal...');
  await page.evaluate((y) => window.scrollTo(0, y), 0.82 * maxScroll);
  await page.waitForTimeout(500);

  const heroTile = await page.$('div[role="button"][aria-label^="Inspect"]');
  if (heroTile) {
    await heroTile.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, 'interaction-living-grid-focus-modal.png') });
    console.log('Captured interaction-living-grid-focus-modal.png');

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // 8. Responsive Viewports:
  const responsiveViewports = [
    { name: 'laptop-1280x800', width: 1280, height: 800 },
    { name: 'tablet-768x1024', width: 768, height: 1024 },
    { name: 'mobile-390x844', width: 390, height: 844 },
    { name: 'mobile-375x812', width: 375, height: 812 },
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
    await page.evaluate((y) => window.scrollTo(0, y), 0.32 * vpMaxScroll);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, `responsive-${vp.name}-ch02-panorama.png`) });

    // Scene 03 Archive
    await page.evaluate((y) => window.scrollTo(0, y), 0.52 * vpMaxScroll);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, `responsive-${vp.name}-archive.png`) });

    // Scene 04 Living Grid
    await page.evaluate((y) => window.scrollTo(0, y), 0.82 * vpMaxScroll);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, `responsive-${vp.name}-grid.png`) });
    console.log(`Captured responsive views for ${vp.name}`);
  }

  await browser.close();
  console.log('V3 Verification suite completed successfully!');
}

runVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
