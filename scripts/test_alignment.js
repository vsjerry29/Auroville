const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testAlignment() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Create simple HTML that loads both images directly from local file paths
  const photoPath = 'http://localhost:3000/photos/matrimandir-real.jpg';
  const illustPath = 'http://localhost:3000/illustrated/ch02-page/matrimandir-illustrated.jpg';

  await page.goto('http://localhost:3000');
  
  const outDir = path.join(__dirname, '../docs/v5/screenshots/alignment');
  fs.mkdirSync(outDir, { recursive: true });

  const variations = [
    { name: 'v1', photoPos: 'center 46%', scale: '1.04', translateY: '-1.2%' },
    { name: 'v2', photoPos: 'center 45%', scale: '1.06', translateY: '-0.8%' },
    { name: 'v3', photoPos: 'center 46%', scale: '1.08', translateY: '-1.5%' },
  ];

  for (const v of variations) {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; background: #191917; }
          .stage { position: relative; width: 1440px; height: 900px; overflow: hidden; background: #F7F4EE; }
          .layer { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
          .illust { z-index: 1; object-position: center 38%; }
          .photo { z-index: 2; object-position: ${v.photoPos}; transform: translateY(${v.translateY}) scale(${v.scale}); opacity: 0.5; }
        </style>
      </head>
      <body>
        <div class="stage">
          <img class="layer illust" src="${illustPath}" />
          <img class="layer photo" src="${photoPath}" />
        </div>
      </body>
      </html>
    `);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, `overlay_${v.name}.png`) });
  }
  await browser.close();
  console.log('Alignment test saved to docs/v5/screenshots/alignment/overlay_50_percent.png');
}

testAlignment();
