const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureFrames() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Measure total scroll height
  const scrollInfo = await page.evaluate(() => {
    return {
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: window.innerHeight,
      maxScroll: document.documentElement.scrollHeight - window.innerHeight,
    };
  });
  console.log('Scroll dimensions:', scrollInfo);

  // Six key progress points for the transformation
  // Chapter 02 is active between global progress 0.20 and 0.46
  // localProgress = (progress - 0.20) / 0.26
  // 1. Sketch: progress = 0.22 (localProgress = 0.077)
  // 2. Wash entering: progress = 0.26 (localProgress = 0.23)
  // 3. Full color illustration: progress = 0.29 (localProgress = 0.346)
  // 4. Mid-reveal (dome photo): progress = 0.33 (localProgress = 0.50)
  // 5. Advanced reveal (ramps photo): progress = 0.37 (localProgress = 0.654)
  // 6. Complete photograph hold: progress = 0.41 (localProgress = 0.808)

  const frames = [
    { name: '01_architectural_pencil_sketch', progress: 0.22, label: 'Frame 1: Architectural Pencil Sketch' },
    { name: '02_watercolor_wash_emerging', progress: 0.26, label: 'Frame 2: Watercolor Wash Emerging' },
    { name: '03_full_colored_illustration', progress: 0.29, label: 'Frame 3: Fully Colored Illustration' },
    { name: '04_radial_dome_photo_reveal', progress: 0.33, label: 'Frame 4: Radial Dome Photo Reveal' },
    { name: '05_ramps_and_landscape_photo', progress: 0.37, label: 'Frame 5: Ramps & Landscape Photo' },
    { name: '06_complete_photograph_hold', progress: 0.41, label: 'Frame 6: Complete Photograph Stable Hold' },
  ];

  const outDir = path.join(__dirname, '../docs/v5/screenshots/transformation_sequence');
  fs.mkdirSync(outDir, { recursive: true });

  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    const targetY = f.progress * scrollInfo.maxScroll;

    console.log(`Scrolling to ${f.name} (progress: ${f.progress}, y: ${Math.round(targetY)})...`);
    await page.evaluate((y) => {
      window.scrollTo({ top: y, behavior: 'instant' });
    }, targetY);

    await page.waitForTimeout(600);

    const screenshotPath = path.join(outDir, `${f.name}.jpg`);
    await page.screenshot({ path: screenshotPath, quality: 92 });
    console.log(`Captured ${screenshotPath}`);
  }

  // Also test rapid reverse scroll from 0.41 back to 0.22 to verify reversibility
  console.log('Testing reverse scroll...');
  await page.evaluate((y) => {
    window.scrollTo({ top: y, behavior: 'instant' });
  }, 0.22 * scrollInfo.maxScroll);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, 'reverse_scroll_verification.jpg'), quality: 92 });
  console.log('Captured reverse scroll verification.');

  // Also capture mobile viewport at Frame 1, Frame 4, and Frame 6
  console.log('Capturing mobile viewport (390x844)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);

  const mobileFrames = [
    { name: 'mobile_01_sketch', progress: 0.22 },
    { name: 'mobile_04_mid_reveal', progress: 0.33 },
    { name: 'mobile_06_photo_hold', progress: 0.41 },
  ];

  for (const mf of mobileFrames) {
    const targetY = mf.progress * scrollInfo.maxScroll;
    await page.evaluate((y) => {
      window.scrollTo({ top: y, behavior: 'instant' });
    }, targetY);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, `${mf.name}.jpg`), quality: 92 });
  }

  console.log('All verification frames captured successfully!');
  await browser.close();
}

captureFrames().catch(console.error);
