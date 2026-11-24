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

    // 1. Draw the master framed photo (1376 x 768)
    const cPhoto = document.createElement('canvas');
    cPhoto.width = W;
    cPhoto.height = H;
    const ctxPhoto = cPhoto.getContext('2d');

    const scale = 1.34375;
    const dx = 688 - (529.5 * scale);
    const dy = -60;
    ctxPhoto.drawImage(photo, dx, dy, photo.naturalWidth * scale, photo.naturalHeight * scale);

    const photoData = ctxPhoto.getImageData(0, 0, W, H);
    const pD = photoData.data;

    // 2. Extract architectural contours / pencil edges (Sobel + morphological thinning)
    // We create a grayscale luminance array
    const gray = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) {
      const idx = i * 4;
      gray[i] = 0.299 * pD[idx] + 0.587 * pD[idx + 1] + 0.114 * pD[idx + 2];
    }

    // Sobel operator
    const edges = new Float32Array(W * H);
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
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

    // 3. Create Architectural Pencil Sketch (Warm ivory paper + graphite linework)
    const cSketch = document.createElement('canvas');
    cSketch.width = W;
    cSketch.height = H;
    const ctxSketch = cSketch.getContext('2d');

    // Fill with warm ivory archival paper
    ctxSketch.fillStyle = '#F6F3EC';
    ctxSketch.fillRect(0, 0, W, H);

    // Subtle paper grain
    const sketchImgData = ctxSketch.getImageData(0, 0, W, H);
    const sD = sketchImgData.data;

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        const idx = i * 4;
        const edgeVal = edges[i];

        // Graphite tone: dark ink for strong edges, fine stippling for midtones
        let inkStrength = Math.min(1, edgeVal / 70);
        // Boost contrast on lines
        inkStrength = Math.pow(inkStrength, 1.4);

        // Add delicate paper texture variation
        const noise = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453 % 1) * 6;

        // Paper base: #F6F3EC -> (246, 243, 236)
        // Graphite stroke: #2B2620 -> (43, 38, 32)
        const baseR = 246 + noise;
        const baseG = 243 + noise;
        const baseB = 236 + noise;

        const graphiteR = 43;
        const graphiteG = 38;
        const graphiteB = 32;

        sD[idx]     = Math.round(baseR * (1 - inkStrength * 0.88) + graphiteR * (inkStrength * 0.88));
        sD[idx + 1] = Math.round(baseG * (1 - inkStrength * 0.88) + graphiteG * (inkStrength * 0.88));
        sD[idx + 2] = Math.round(baseB * (1 - inkStrength * 0.88) + graphiteB * (inkStrength * 0.88));
        sD[idx + 3] = 255;
      }
    }
    ctxSketch.putImageData(sketchImgData, 0, 0);

    // Add architectural drafting linework: dome elevation drafting circles and horizon axes
    const domeCX = 688;
    const domeCY = 404;
    const domeR = 261;

    ctxSketch.save();
    ctxSketch.strokeStyle = '#6E5C4B';
    ctxSketch.lineWidth = 0.75;
    ctxSketch.setLineDash([4, 4]);
    ctxSketch.globalAlpha = 0.45;

    // Circumscribed elevation drafting circles
    ctxSketch.beginPath();
    ctxSketch.arc(domeCX, domeCY, domeR, 0, Math.PI * 2);
    ctxSketch.stroke();

    ctxSketch.beginPath();
    ctxSketch.arc(domeCX, domeCY, domeR + 32, 0, Math.PI * 2);
    ctxSketch.stroke();

    // Horizontal drafting guide
    ctxSketch.beginPath();
    ctxSketch.moveTo(120, domeCY);
    ctxSketch.lineTo(W - 120, domeCY);
    ctxSketch.stroke();

    // Vertical zenith guide
    ctxSketch.beginPath();
    ctxSketch.moveTo(domeCX, 60);
    ctxSketch.lineTo(domeCX, H - 60);
    ctxSketch.stroke();

    // Architectural study notation in lower margin
    ctxSketch.font = '10px monospace';
    ctxSketch.fillStyle = '#6E5C4B';
    ctxSketch.globalAlpha = 0.65;
    ctxSketch.fillText('MATRIMANDIR · PEACE AREA · ELEVATION 01 · 36M SPHERE', domeCX - 150, H - 28);
    ctxSketch.restore();

    // 4. Create Colored Illustration (Pencil Sketch + Rich Watercolor Glaze)
    const cColor = document.createElement('canvas');
    cColor.width = W;
    cColor.height = H;
    const ctxColor = cColor.getContext('2d');

    // Draw the pencil sketch base first
    ctxColor.drawImage(cSketch, 0, 0);

    // Create a painterly watercolor wash from the photo
    // Soft blur + color boost to simulate translucent pigment wash over paper
    const cWash = document.createElement('canvas');
    cWash.width = W;
    cWash.height = H;
    const ctxWash = cWash.getContext('2d');
    ctxWash.filter = 'saturate(135%) contrast(108%) blur(2.5px)';
    ctxWash.drawImage(cPhoto, 0, 0);

    // Blend wash onto sketch using multiply mode for authentic pigment absorption
    ctxColor.globalCompositeOperation = 'multiply';
    ctxColor.globalAlpha = 0.78;
    ctxColor.drawImage(cWash, 0, 0);

    // Overlay a touch of paper texture back on top
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

  const outDir = path.join(__dirname, '../docs/v5/screenshots/alignment/test_triplet');
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(path.join(outDir, '01_sketch.jpg'), Buffer.from(renders.sketch.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));
  fs.writeFileSync(path.join(outDir, '02_color.jpg'), Buffer.from(renders.color.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));
  fs.writeFileSync(path.join(outDir, '03_photo.jpg'), Buffer.from(renders.photo.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));

  console.log('Saved test triplet to docs/v5/screenshots/alignment/test_triplet/');
  await browser.close();
})();
