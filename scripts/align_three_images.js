const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function alignImages() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000');

  const result = await page.evaluate(async () => {
    function loadImg(src) {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.src = src;
      });
    }

    const photo = await loadImg('/photos/matrimandir-real.jpg');
    const illust = await loadImg('/illustrated/ch02-page/matrimandir-illustrated.jpg');

    // Master Canvas dimensions: 1376 x 768 (16:9)
    const W = 1376;
    const H = 768;

    // Scale factor to map photo dome to illustration dome:
    const bestScale = 1.34;
    const bestDx = -0.5;
    const bestDy = -117.5;

    const cPhoto = document.createElement('canvas');
    cPhoto.width = W;
    cPhoto.height = H;
    const ctxPhoto = cPhoto.getContext('2d');
    ctxPhoto.drawImage(photo, bestDx, bestDy, photo.naturalWidth * bestScale, photo.naturalHeight * bestScale);

    // Create the aligned pencil sketch from the illustration:
    // Warm ivory paper (#F7F4EE) + high-contrast graphite ink line art
    const cSketch = document.createElement('canvas');
    cSketch.width = W;
    cSketch.height = H;
    const ctxSketch = cSketch.getContext('2d');

    ctxSketch.fillStyle = '#F7F4EE';
    ctxSketch.fillRect(0, 0, W, H);

    ctxSketch.filter = 'contrast(240%) grayscale(100%) brightness(108%)';
    ctxSketch.globalAlpha = 0.85;
    ctxSketch.drawImage(illust, 0, 0, W, H);
    ctxSketch.filter = 'none';

    // Add delicate architectural drafting circles and rays around dome
    ctxSketch.strokeStyle = '#5A422D';
    ctxSketch.lineWidth = 0.8;
    ctxSketch.setLineDash([4, 4]);
    ctxSketch.globalAlpha = 0.35;
    ctxSketch.beginPath();
    ctxSketch.arc(692, 382, 285, 0, Math.PI * 2);
    ctxSketch.stroke();

    ctxSketch.beginPath();
    ctxSketch.arc(692, 382, 320, 0, Math.PI * 2);
    ctxSketch.stroke();

    return {
      alignedPhotoDataUrl: cPhoto.toDataURL('image/jpeg', 0.95),
      alignedSketchDataUrl: cSketch.toDataURL('image/jpeg', 0.95),
      scale: bestScale,
      dx: bestDx,
      dy: bestDy,
    };
  });

  // Save the aligned assets
  const publicDir = path.join(__dirname, '../public/matrimandir-sequence');
  fs.mkdirSync(publicDir, { recursive: true });

  const photoBuffer = Buffer.from(result.alignedPhotoDataUrl.replace(/^data:image\/jpeg;base64,/, ''), 'base64');
  fs.writeFileSync(path.join(publicDir, '03-photo-aligned.jpg'), photoBuffer);

  const sketchBuffer = Buffer.from(result.alignedSketchDataUrl.replace(/^data:image\/jpeg;base64,/, ''), 'base64');
  fs.writeFileSync(path.join(publicDir, '01-sketch-aligned.jpg'), sketchBuffer);

  // Copy 02-illust-aligned.jpg directly from matrimandir-illustrated.jpg (1376x768)
  fs.copyFileSync(
    path.join(__dirname, '../public/illustrated/ch02-page/matrimandir-illustrated.jpg'),
    path.join(publicDir, '02-color-aligned.jpg')
  );

  console.log('Saved all 3 aligned images to public/matrimandir-sequence/');

  // Create an overlay test image of all three
  const testPage = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  await testPage.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; background: #000; overflow: hidden; }
        .layer { position: absolute; inset: 0; width: 1376px; height: 768px; }
        .photo { opacity: 0.5; }
        .sketch { mix-blend-mode: multiply; opacity: 0.5; }
      </style>
    </head>
    <body>
      <img class="layer illust" src="http://localhost:3000/matrimandir-sequence/02-color-aligned.jpg" />
      <img class="layer photo" src="http://localhost:3000/matrimandir-sequence/03-photo-aligned.jpg" />
      <img class="layer sketch" src="http://localhost:3000/matrimandir-sequence/01-sketch-aligned.jpg" />
    </body>
    </html>
  `);
  await testPage.waitForTimeout(300);
  const outDir = path.join(__dirname, '../docs/v5/screenshots/alignment');
  fs.mkdirSync(outDir, { recursive: true });
  await testPage.screenshot({ path: path.join(outDir, 'aligned_triplet_overlay.png') });
  console.log('Saved triplet overlay to docs/v5/screenshots/alignment/aligned_triplet_overlay.png');

  await browser.close();
}

alignImages().catch(console.error);
