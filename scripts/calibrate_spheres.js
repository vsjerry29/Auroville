const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000');

  const sphereData = await page.evaluate(async () => {
    function loadImg(src) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
      });
    }

    const photo = await loadImg('/photos/matrimandir-real.jpg');
    const illust = await loadImg('/illustrated/ch02-page/matrimandir-illustrated.jpg');

    // Canvas for measuring:
    // We want to find:
    // 1. In illust (1376 x 768):
    // What is top of dome, bottom of dome, left of dome, right of dome?
    // 2. In photo (1024 x 682):
    // What is top of dome, bottom of dome, left of dome, right of dome?

    // Let's sample pixel rows and columns or do edge scanning
    function getSphereBounds(img, w, h) {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      return c;
    }

    return { photoW: photo.naturalWidth, photoH: photo.naturalHeight, illustW: illust.naturalWidth, illustH: illust.naturalHeight };
  });

  // Let's create an HTML visual calibrator to find the exact circle (cx, cy, r) for both!
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; background: #222; color: #fff; font-family: monospace; display: flex; }
        .pane { position: relative; margin: 10px; }
        canvas { display: block; }
        .info { position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.8); padding: 5px; }
      </style>
    </head>
    <body>
      <div class="pane">
        <canvas id="cIllust" width="1376" height="768" style="width:688px; height:384px;"></canvas>
        <div class="info" id="illustInfo">Illustration</div>
      </div>
      <div class="pane">
        <canvas id="cPhoto" width="1024" height="682" style="width:688px; height:458px;"></canvas>
        <div class="info" id="photoInfo">Photo</div>
      </div>
      <script>
        async function run() {
          function loadImg(src) {
            return new Promise((r) => { const img = new Image(); img.onload = () => r(img); img.src = src; });
          }
          const photo = await loadImg('/photos/matrimandir-real.jpg');
          const illust = await loadImg('/illustrated/ch02-page/matrimandir-illustrated.jpg');

          const cI = document.getElementById('cIllust');
          const ctxI = cI.getContext('2d');
          ctxI.drawImage(illust, 0, 0);

          const cP = document.getElementById('cPhoto');
          const ctxP = cP.getContext('2d');
          ctxP.drawImage(photo, 0, 0);

          // Let's draw guide circles to find exact (cx, cy, r)
          // We can test ranges of cx, cy, r for illust:
          // In illust (1376x768):
          // Top of dome is around y=68, bottom is around y=552, left is around x=450, right is around x=934
          // Center would be around cx = (450+934)/2 = 692, cy = (68+552)/2 = 310, r = 242.
          // In previous script, r was 285, cy was 382! 382 is WAY too low (near the pillars)!
          
          window.measurements = {
            illust: { cx: 692, cy: 310, r: 242 },
          };
        }
        run();
      </script>
    </body>
    </html>
  `);

  await page.waitForTimeout(500);

  // Now let's calculate exact edges by scanning the golden discs color/contrast in both images!
  const measurements = await page.evaluate(async () => {
    function loadImg(src) {
      return new Promise((r) => { const img = new Image(); img.onload = () => r(img); img.src = src; });
    }
    const photo = await loadImg('/photos/matrimandir-real.jpg');
    const illust = await loadImg('/illustrated/ch02-page/matrimandir-illustrated.jpg');

    function analyze(img, w, h) {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      return { c, ctx, data };
    }

    const iData = analyze(illust, 1376, 768);
    const pData = analyze(photo, 1024, 682);

    return {
      test: 'loaded'
    };
  });

  await browser.close();
})();
