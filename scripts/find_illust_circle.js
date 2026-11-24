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

    // In calculated_1.311.jpg, the photo dome fit into (cx=687, cy=370, r=255).
    // Now let's see what the illustration dome's circle actually is!
    // In illust:
    // Top of dome is y ~ 68? Or let's test circles on illust alone!
    const illustCircles = [
      { cx: 688, cy: 360, r: 290, color: '#00ff00' },
      { cx: 688, cy: 360, r: 295, color: '#ffff00' },
      { cx: 688, cy: 365, r: 295, color: '#ff00ff' },
      { cx: 688, cy: 365, r: 300, color: '#00ffff' },
    ];

    ctx.drawImage(illust, 0, 0, W, H);
    illustCircles.forEach(ic => {
      ctx.strokeStyle = ic.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ic.cx, ic.cy, ic.r, 0, Math.PI * 2);
      ctx.stroke();
    });

    return c.toDataURL('image/jpeg', 0.95);
  });

  const outPath = path.join(__dirname, '../docs/v5/screenshots/alignment/tuning/illust_circle_fit.jpg');
  fs.writeFileSync(outPath, Buffer.from(fitResult.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));
  console.log('Saved illust_circle_fit.jpg');
  await browser.close();
})();
