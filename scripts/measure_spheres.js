const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000');

  const coords = await page.evaluate(async () => {
    function loadImg(src) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
      });
    }

    const photo = await loadImg('/photos/matrimandir-real.jpg');
    const illust = await loadImg('/illustrated/ch02-page/matrimandir-illustrated.jpg');

    return {
      photoNatW: photo.naturalWidth,
      photoNatH: photo.naturalHeight,
      illustNatW: illust.naturalWidth,
      illustNatH: illust.naturalHeight,
    };
  });

  console.log('Image dimensions:', coords);
  await browser.close();
})();
