const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testMask() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:3000');

  const photoPath = 'http://localhost:3000/photos/matrimandir-real.jpg';
  const illustPath = 'http://localhost:3000/illustrated/ch02-page/matrimandir-illustrated.jpg';

  const outDir = path.join(__dirname, '../docs/v5/screenshots/mask_test');
  fs.mkdirSync(outDir, { recursive: true });

  const stages = [
    { name: '01_illustrated_only', radius: 0, feather: 10, photoOpacity: 1, lineworkOpacity: 0 },
    { name: '02_dome_revealing', radius: 18, feather: 12, photoOpacity: 1, lineworkOpacity: 0.6 },
    { name: '03_ramps_revealing', radius: 45, feather: 15, photoOpacity: 1, lineworkOpacity: 0.35 },
    { name: '04_trees_sky_revealing', radius: 80, feather: 20, photoOpacity: 1, lineworkOpacity: 0.15 },
    { name: '05_photo_full', radius: 140, feather: 20, photoOpacity: 1, lineworkOpacity: 0 },
  ];

  for (const s of stages) {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; background: #191917; font-family: sans-serif; }
          .stage { position: relative; width: 1440px; height: 900px; overflow: hidden; background: #F7F4EE; }
          .layer { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
          .illust { z-index: 1; object-position: center 38%; }
          .photo-container {
            position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2;
            -webkit-mask-image: radial-gradient(circle at 50.5% 42%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${s.radius}%, rgba(0,0,0,0) ${s.radius + s.feather}%);
            mask-image: radial-gradient(circle at 50.5% 42%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${s.radius}%, rgba(0,0,0,0) ${s.radius + s.feather}%);
          }
          .photo { width: 100%; height: 100%; object-fit: cover; object-position: center 45%; transform: translateY(-0.8%) scale(1.06); }
          .linework {
            position: absolute; inset: 0; width: 100%; height: 100%; z-index: 3; pointer-events: none;
            mix-blend-mode: multiply; opacity: ${s.lineworkOpacity};
            background-image: url('${illustPath}');
            background-size: cover; background-position: center 38%;
            filter: contrast(160%) grayscale(100%);
          }
        </style>
      </head>
      <body>
        <div class="stage">
          <img class="layer illust" src="${illustPath}" />
          <div class="photo-container">
            <img class="photo" src="${photoPath}" />
          </div>
          <div class="linework"></div>
        </div>
      </body>
      </html>
    `);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, `${s.name}.png`) });
    console.log(`Captured ${s.name}`);
  }

  await browser.close();
}

testMask();
