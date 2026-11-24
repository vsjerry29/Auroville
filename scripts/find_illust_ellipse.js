const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000');

  const fitResult = await page.evaluate(async () => {
    function loadImg(src) {
      return new Promise((r) => { const img = new Image(); img.onload = () => r(img); img.src = src; });
    }
    const photo = await loadImg('/photos/matrimandir-real.jpg');
    const illust = await loadImg('/illustrated/ch02-page/matrimandir-illustrated.jpg');

    const W = 1376;
    const H = 768;

    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d');

    // In illust:
    // Let's test ellipses: cx, cy, rx, ry
    // Dome top ~ y = 152
    // Bottom (at base of pillars/ramp intersection) ~ y = 575
    // ry = (575 - 152) / 2 = 211.5
    // cy = 152 + 211.5 = 363.5
    // Left edge ~ x = 405
    // Right edge ~ x = 970
    // rx = (970 - 405) / 2 = 282.5
    // cx = 405 + 282.5 = 687.5

    const illustEllipses = [
      { cx: 688, cy: 375, rx: 285, ry: 228, color: '#ff0000' },
      { cx: 688, cy: 375, rx: 288, ry: 226, color: '#00ff00' },
      { cx: 688, cy: 372, rx: 286, ry: 224, color: '#00ffff' },
    ];

    ctx.drawImage(illust, 0, 0, W, H);
    illustEllipses.forEach(e => {
      ctx.strokeStyle = e.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(e.cx, e.cy, e.rx, e.ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    });

    return c.toDataURL('image/jpeg', 0.95);
  });

  const outPath = path.join(__dirname, '../docs/v5/screenshots/alignment/tuning/illust_ellipse_fit.jpg');
  fs.writeFileSync(outPath, Buffer.from(fitResult.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));
  console.log('Saved illust_ellipse_fit.jpg');
  await browser.close();
})();
