const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000');

  const renders = await page.evaluate(async () => {
    function loadImg(src) {
      return new Promise((r) => { const img = new Image(); img.onload = () => r(img); img.src = src; });
    }
    const photo = await loadImg('/photos/matrimandir-real.jpg');

    const W = 1376;
    const H = 768;

    // Scale to fill the canvas completely with zero uncovered margin
    const scale = 1.38;
    const photoRenderW = photo.naturalWidth * scale; // 1413.12
    const photoRenderH = photo.naturalHeight * scale; // 941.16

    // Center dome horizontally at x = W / 2 = 688:
    // Photo dome center was at x = 529.5:
    const dx = 688 - (529.5 * scale); // 688 - 730.71 = -42.71
    // Vertical placement: lotus petal at bottom margin, dome nicely centered
    // Photo dome center was at y = 345.5:
    // If we want dome center at y = 400:
    const dy = 400 - (345.5 * scale); // 400 - 476.79 = -76.79

    const cPhoto = document.createElement('canvas');
    cPhoto.width = W;
    cPhoto.height = H;
    const ctxPhoto = cPhoto.getContext('2d');
    ctxPhoto.drawImage(photo, dx, dy, photoRenderW, photoRenderH);

    const pD = ctxPhoto.getImageData(0, 0, W, H).data;

    // Actual dome center and radius
    const domeCX = Math.round(529.5 * scale + dx); // 688
    const domeCY = Math.round(345.5 * scale + dy); // 400
    const domeR = Math.round(194.5 * scale); // 268

    // Build grayscale and sky probability map
    const gray = new Float32Array(W * H);
    const skyProb = new Float32Array(W * H);

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        const idx = i * 4;
        const r = pD[idx];
        const g = pD[idx + 1];
        const b = pD[idx + 2];
        gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;

        const dist = Math.hypot(x - domeCX, y - domeCY);

        // Sky detection:
        // Sky is outside the dome (dist > domeR + 4) and has blue tint or bright white cloud
        if (dist > domeR + 4) {
          // Blue sky: b > r + 10 && b > 140
          // Or bright clouds in the upper half of image (y < 420): r > 175 && g > 185 && b > 195
          // Exclude foliage: foliage has g > r && g > b && b < 140
          const isFoliage = (g > b + 15 && g > r - 20) || (r < 100 && g < 110 && b < 100);
          if (!isFoliage && y < 440) {
            if (b > r + 15 && b > 130) {
              skyProb[i] = 1.0;
            } else if (r > 170 && g > 175 && b > 185) {
              skyProb[i] = 0.95;
            }
          }
        }
      }
    }

    // Sobel edge filter
    const edges = new Float32Array(W * H);
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        if (skyProb[i] > 0.5) {
          edges[i] = 0;
          continue;
        }
        const gx =
          -1 * gray[i - W - 1] + 1 * gray[i - W + 1] +
          -2 * gray[i - 1]     + 2 * gray[i + 1] +
          -1 * gray[i + W - 1] + 1 * gray[i + W + 1];
        const gy =
          -1 * gray[i - W - 1] - 2 * gray[i - W] - 1 * gray[i - W + 1] +
           1 * gray[i + W - 1] + 2 * gray[i + W] + 1 * gray[i + W + 1];
        edges[i] = Math.sqrt(gx * gx + gy * gy);
      }
    }

    // 1. Render Architectural Pencil Sketch
    const cSketch = document.createElement('canvas');
    cSketch.width = W;
    cSketch.height = H;
    const ctxSketch = cSketch.getContext('2d');

    ctxSketch.fillStyle = '#F7F4EE';
    ctxSketch.fillRect(0, 0, W, H);

    const sketchData = ctxSketch.getImageData(0, 0, W, H);
    const sD = sketchData.data;

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        const idx = i * 4;

        if (skyProb[i] > 0.7) {
          sD[idx] = 247;
          sD[idx + 1] = 244;
          sD[idx + 2] = 238;
          sD[idx + 3] = 255;
          continue;
        }

        const edgeVal = edges[i];
        let ink = Math.min(1, edgeVal / 58);
        ink = Math.pow(ink, 1.25);

        const lum = gray[i] / 255;
        let tone = 0;
        if (lum < 0.40) {
          tone = (0.40 - lum) * 0.45;
        }

        const combined = Math.min(1, ink * 0.90 + tone);

        sD[idx]     = Math.round(247 * (1 - combined) + 34 * combined);
        sD[idx + 1] = Math.round(244 * (1 - combined) + 30 * combined);
        sD[idx + 2] = Math.round(238 * (1 - combined) + 26 * combined);
        sD[idx + 3] = 255;
      }
    }
    ctxSketch.putImageData(sketchData, 0, 0);

    // Architectural drafting linework
    ctxSketch.save();
    ctxSketch.strokeStyle = '#5A4634';
    ctxSketch.lineWidth = 0.85;
    ctxSketch.setLineDash([6, 5]);
    ctxSketch.globalAlpha = 0.45;

    // Dome circle and concentric outer drafting ring
    ctxSketch.beginPath();
    ctxSketch.arc(domeCX, domeCY, domeR, 0, Math.PI * 2);
    ctxSketch.stroke();

    ctxSketch.beginPath();
    ctxSketch.arc(domeCX, domeCY, domeR + 38, 0, Math.PI * 2);
    ctxSketch.stroke();

    // Drafting rays
    [30, 45, 60, 120, 135, 150].forEach(deg => {
      const rad = (deg * Math.PI) / 180;
      ctxSketch.beginPath();
      ctxSketch.moveTo(domeCX + Math.cos(rad) * (domeR - 25), domeCY - Math.sin(rad) * (domeR - 25));
      ctxSketch.lineTo(domeCX + Math.cos(rad) * (domeR + 55), domeCY - Math.sin(rad) * (domeR + 55));
      ctxSketch.stroke();
    });

    // Horizontal & vertical guide lines
    ctxSketch.beginPath();
    ctxSketch.moveTo(60, domeCY);
    ctxSketch.lineTo(W - 60, domeCY);
    ctxSketch.stroke();

    ctxSketch.beginPath();
    ctxSketch.moveTo(domeCX, 40);
    ctxSketch.lineTo(domeCX, H - 40);
    ctxSketch.stroke();

    // Study notation
    ctxSketch.font = '600 11px monospace';
    ctxSketch.fillStyle = '#5A4634';
    ctxSketch.globalAlpha = 0.70;
    ctxSketch.fillText('MATRIMANDIR · PEACE AREA · ELEVATION STUDY', domeCX - 150, H - 24);
    ctxSketch.fillText('R = 18.00M', domeCX + domeR + 45, domeCY + 4);
    ctxSketch.fillText('1,415 GILDED DISCS · CONVERGING RAMPS', domeCX - 130, H - 10);
    ctxSketch.restore();

    // 2. Render Colored Illustration
    const cColor = document.createElement('canvas');
    cColor.width = W;
    cColor.height = H;
    const ctxColor = cColor.getContext('2d');

    ctxColor.drawImage(cSketch, 0, 0);

    const cWash = document.createElement('canvas');
    cWash.width = W;
    cWash.height = H;
    const ctxWash = cWash.getContext('2d');
    ctxWash.filter = 'saturate(145%) contrast(110%) blur(2.2px)';
    ctxWash.drawImage(cPhoto, 0, 0);

    // Blend wash onto sketch using multiply mode
    ctxColor.globalCompositeOperation = 'multiply';
    ctxColor.globalAlpha = 0.82;
    ctxColor.drawImage(cWash, 0, 0);

    ctxColor.globalCompositeOperation = 'source-over';
    ctxColor.globalAlpha = 1.0;

    return {
      photo: cPhoto.toDataURL('image/jpeg', 0.95),
      sketch: cSketch.toDataURL('image/jpeg', 0.95),
      color: cColor.toDataURL('image/jpeg', 0.95),
      domeCenter: { x: domeCX, y: domeCY },
      domeRadius: domeR,
    };
  });

  const publicSeqDir = path.join(__dirname, '../public/matrimandir-sequence');
  fs.mkdirSync(publicSeqDir, { recursive: true });

  fs.writeFileSync(path.join(publicSeqDir, '01-sketch-aligned.jpg'), Buffer.from(renders.sketch.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));
  fs.writeFileSync(path.join(publicSeqDir, '02-color-aligned.jpg'), Buffer.from(renders.color.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));
  fs.writeFileSync(path.join(publicSeqDir, '03-photo-aligned.jpg'), Buffer.from(renders.photo.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));

  console.log('Saved perfected sequence to public/matrimandir-sequence/!');
  await browser.close();
})();
