const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000');

  const result = await page.evaluate(async () => {
    function loadImg(src) {
      return new Promise((r) => { const img = new Image(); img.onload = () => r(img); img.src = src; });
    }
    const photo = await loadImg('/photos/matrimandir-real.jpg');
    const illust = await loadImg('/illustrated/ch02-page/matrimandir-illustrated.jpg');

    function getBounds(img, name) {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const idata = ctx.getImageData(0, 0, w, h);
      const d = idata.data;

      // Let's sample along vertical center line x = w/2
      // and horizontal line through middle
      const cx_approx = Math.round(w / 2);
      
      // Let's find the top of the sphere along x = cx_approx
      // Sky is bluish/whitish. The sphere is golden/yellow/dark gold.
      // Let's print out the RGB values along the vertical center line
      const verticalProfile = [];
      for (let y = 0; y < h; y += 4) {
        const idx = (y * w + cx_approx) * 4;
        const r = d[idx];
        const g = d[idx + 1];
        const b = d[idx + 2];
        verticalProfile.push({ y, r, g, b });
      }

      return { w, h, verticalProfile };
    }

    return {
      illust: getBounds(illust, 'illust'),
      photo: getBounds(photo, 'photo')
    };
  });

  // Let's find top of dome in illust
  // In illust, sky is (245, 240, 230) or light blue/ivory. When hitting gold dome, (r, g, b) changes drastically.
  console.log('=== ILLUSTRATION VERTICAL PROFILE (around center X) ===');
  for (const p of result.illust.verticalProfile) {
    if (p.y >= 50 && p.y <= 120) {
      console.log(`y=${p.y}: R=${p.r}, G=${p.g}, B=${p.b}`);
    }
  }

  console.log('=== PHOTO VERTICAL PROFILE (around center X) ===');
  for (const p of result.photo.verticalProfile) {
    if (p.y >= 100 && p.y <= 200) {
      console.log(`y=${p.y}: R=${p.r}, G=${p.g}, B=${p.b}`);
    }
  }

  await browser.close();
})();
