const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000');

  const photoFrame = await page.evaluate(async () => {
    function loadImg(src) {
      return new Promise((r) => { const img = new Image(); img.onload = () => r(img); img.src = src; });
    }
    const photo = await loadImg('/photos/matrimandir-real.jpg');

    const W = 1376;
    const H = 768;

    // The photo is 1024 x 682 (aspect ratio 1.50).
    // The canvas is 1376 x 768 (aspect ratio 1.7917).
    // To cover 1376 x 768:
    // Scale = Math.max(1376 / 1024, 768 / 682) = Math.max(1.34375, 1.126) = 1.34375!
    // With scale = 1.34375:
    // rendered width = 1024 * 1.34375 = 1376 px!
    // rendered height = 682 * 1.34375 = 916.4 px!
    // Excess vertical height = 916.4 - 768 = 148.4 px.
    // If we center vertically: dy = -148.4 / 2 = -74.2 px.
    // If we want slightly more sky or slightly more lawn:
    // With dy = -74 px:
    // Top of photo is at -74. Photo dome top was at 151 * 1.34375 - 74 = 202.9 - 74 = 129 px!
    // Photo dome bottom was at 540 * 1.34375 - 74 = 725.6 - 74 = 651.6 px!
    // Dome height = 651.6 - 129 = 522.6 px!
    // Center X = 1376 / 2 = 688 px! (Photo center was 529.5 * 1.34375 = 711.5, so dx = -23.5 px centers the dome at x = 688!)

    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d');

    const scale = 1.34375;
    const dx = 688 - (529.5 * scale); // Centers the dome horizontally at x = 688!
    // Let's place the dome vertically so the lotus and lawn are beautifully visible:
    // In photo, lotus petal bottom is around y = 570. Scaled: 570 * 1.34375 = 765.9.
    // If dy = -60: lotus bottom is at 705.9, lawn is 62px at bottom!
    // Dome top is at 151 * 1.34375 - 60 = 202.9 - 60 = 142.9 px. Sky is 143px at top!
    const dy = -60;

    ctx.drawImage(photo, dx, dy, photo.naturalWidth * scale, photo.naturalHeight * scale);

    return {
      dataUrl: c.toDataURL('image/jpeg', 0.95),
      dx, dy, scale,
      domeCenter: { x: 688, y: Math.round((151 + 194.5) * scale + dy) },
      domeRadius: Math.round(194.5 * scale)
    };
  });

  console.log('Framed Photo Info:', photoFrame.domeCenter, 'radius:', photoFrame.domeRadius, 'dx:', photoFrame.dx, 'dy:', photoFrame.dy);

  const outPath = path.join(__dirname, '../docs/v5/screenshots/alignment/framed_real_photo.jpg');
  fs.writeFileSync(outPath, Buffer.from(photoFrame.dataUrl.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));
  console.log('Saved framed_real_photo.jpg');
  await browser.close();
})();
