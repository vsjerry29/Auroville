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

  // 4. Test Scene 03 Layered Document Reveal Drag
  console.log('Testing Scene 03 Layered Document Drag Reveal...');
  await page.evaluate((y) => window.scrollTo(0, y), 0.52 * maxScroll);
  await page.waitForTimeout(500);

  const dragLayer = await page.$('[role="region"][aria-label="Layered archival documents"]');
  if (dragLayer) {
    const box = await dragLayer.boundingBox();
    if (box) {
      // Drag top layer from left toward right by 40%
      await page.mouse.move(box.x + 30, box.y + box.height * 0.5);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.5, { steps: 8 });
      await page.mouse.up();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(screenshotDir, 'interaction-archive-layer-dragged.png') });
      console.log('Captured interaction-archive-layer-dragged.png');
    }
  }

  // 5. Test Scene 04 Click-to-Focus Modal
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

  // 6. Responsive Viewports:
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

    // Scene 03 Archive
    const vpMaxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
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
