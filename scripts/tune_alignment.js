const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000');

  // Let's test a fine grid of scales around 1.31 and dy around -83
  const bestFit = await page.evaluate(async () => {
    function loadImg(src) {
      return new Promise((r) => { const img = new Image(); img.onload = () => r(img); img.src = src; });
    }
    const photo = await loadImg('/photos/matrimandir-real.jpg');
    const illust = await loadImg('/illustrated/ch02-page/matrimandir-illustrated.jpg');

    const W = 1376;
    const H = 768;

    // Let's render both and compare edges
    // We want the perimeter circle of the dome to align down to 0.5px.
    // Illust dome circle: cx = 687, cy = 370, r = 255.
    
    // Let's check with an interactive canvas
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d');

    // Return function to test a (scale, dx, dy)
    function testParams(scale, dx, dy) {
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(illust, 0, 0, W, H);
      ctx.globalAlpha = 0.5;
      ctx.drawImage(photo, dx, dy, photo.naturalWidth * scale, photo.naturalHeight * scale);
      ctx.globalAlpha = 1.0;

      // Draw red circle of illust dome
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(687, 370, 255, 0, Math.PI * 2);
      ctx.stroke();

      return c.toDataURL('image/jpeg', 0.9);
    }

    // Try a few candidate values
    const candidates = [
      { scale: 1.311, dx: -7.2, dy: -83.0, label: 'calculated_1.311' },
      { scale: 1.315, dx: -9.0, dy: -84.0, label: 'cand_1.315' },
      { scale: 1.320, dx: -12.0, dy: -85.0, label: 'cand_1.320' },
      { scale: 1.305, dx: -4.0, dy: -82.0, label: 'cand_1.305' },
    ];

    const results = candidates.map(c => ({
      ...c,
      dataUrl: testParams(c.scale, c.dx, c.dy)
    }));

    return results;
  });

  const outDir = path.join(__dirname, '../docs/v5/screenshots/alignment/tuning');
  fs.mkdirSync(outDir, { recursive: true });

  for (const res of bestFit) {
    const buf = Buffer.from(res.dataUrl.replace(/^data:image\/jpeg;base64,/, ''), 'base64');
    fs.writeFileSync(path.join(outDir, `${res.label}.jpg`), buf);
  }

  console.log('Saved candidate overlays to docs/v5/screenshots/alignment/tuning/');
  await browser.close();
})();
