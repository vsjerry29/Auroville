const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000');

  const bounds = await page.evaluate(async () => {
    function loadImg(src) {
      return new Promise((r) => { const img = new Image(); img.onload = () => r(img); img.src = src; });
    }
    const photo = await loadImg('/photos/matrimandir-real.jpg');
    const illust = await loadImg('/illustrated/ch02-page/matrimandir-illustrated.jpg');

    function analyzeDome(img, w, h, name) {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, w, h).data;

      // Find horizontal bounds around mid-height of dome
      // In illust, mid height is around y=300..320
      // In photo, mid height is around y=280..320
      return { w, h };
    }

    return { photoW: photo.naturalWidth, illustW: illust.naturalWidth };
  });

  // Let's create an interactive or automated visual overlay tool with sliders / search
  // that finds the exact scale, dx, dy to make the photo dome match the illustration dome PERFECTLY!
  const bestFit = await page.evaluate(async () => {
    function loadImg(src) {
      return new Promise((r) => { const img = new Image(); img.onload = () => r(img); img.src = src; });
    }
    const photo = await loadImg('/photos/matrimandir-real.jpg');
    const illust = await loadImg('/illustrated/ch02-page/matrimandir-illustrated.jpg');

    const W = 1376;
    const H = 768;

    // Create a canvas with illust dome edge
    // Let's find dome center and radius in illust:
    // Let's test a circle (cx, cy, r) on illust:
    // We know top is y = 115.
    // What is left, right, bottom of dome?
    const cI = document.createElement('canvas');
    cI.width = W;
    cI.height = H;
    const ctxI = cI.getContext('2d');
    ctxI.drawImage(illust, 0, 0);
    const dI = ctxI.getImageData(0, 0, W, H).data;

    // Scan horizontally across y = 280 (near equator of dome)
    // Find where dome starts on left and ends on right
    let leftX_I = 0, rightX_I = 0;
    for (let x = 300; x < 650; x++) {
      const idx = (280 * W + x) * 4;
      // when we leave forest/sky and hit gold
      // Gold has R > 150, B < 120
      if (dI[idx] > 160 && dI[idx+1] > 140 && dI[idx+2] < 120) {
        leftX_I = x;
        break;
      }
    }
    for (let x = 1100; x > 750; x--) {
      const idx = (280 * W + x) * 4;
      if (dI[idx] > 160 && dI[idx+1] > 140 && dI[idx+2] < 120) {
        rightX_I = x;
        break;
      }
    }

    // Now for photo (1024 x 682):
    const cP = document.createElement('canvas');
    cP.width = photo.naturalWidth;
    cP.height = photo.naturalHeight;
    const ctxP = cP.getContext('2d');
    ctxP.drawImage(photo, 0, 0);
    const dP = ctxP.getImageData(0, 0, photo.naturalWidth, photo.naturalHeight).data;

    let leftX_P = 0, rightX_P = 0;
    // in photo, dome equator is around y = 300
    for (let x = 200; x < 500; x++) {
      const idx = (300 * 1024 + x) * 4;
      // Trees are dark green: R < 70, G < 90, B < 70.
      // Gold dome has R > 130, G > 100, B < 70
      if (dP[idx] > 140 && dP[idx+1] > 110 && dP[idx+2] < 80) {
        leftX_P = x;
        break;
      }
    }
    for (let x = 850; x > 550; x--) {
      const idx = (300 * 1024 + x) * 4;
      if (dP[idx] > 140 && dP[idx+1] > 110 && dP[idx+2] < 80) {
        rightX_P = x;
        break;
      }
    }

    return {
      illust: { leftX: leftX_I, rightX: rightX_I, topY: 115 },
      photo: { leftX: leftX_P, rightX: rightX_P, topY: 151 }
    };
  });

  console.log('Detected Bounds:', bestFit);
  await browser.close();
})();
