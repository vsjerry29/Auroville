const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; background: #f7f4ee; font-family: sans-serif; }
        .row { display: flex; flex-direction: row; width: 100vw; height: 50vh; }
        .col { flex: 1; position: relative; border: 1px solid #ddd; overflow: hidden; }
        .col img { width: 100%; height: 100%; object-fit: cover; }
        .col h3 { position: absolute; top: 10px; left: 10px; margin: 0; background: rgba(255,255,255,0.85); padding: 4px 8px; font-size: 12px; }
        .overlay-box { position: relative; width: 800px; height: 446px; margin: 20px auto; border: 2px solid #333; }
        .overlay-box img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      </style>
    </head>
    <body>
      <div class="row">
        <div class="col">
          <h3>1. Architectural Pencil Sketch</h3>
          <img src="http://localhost:3000/matrimandir-sequence/01-sketch-aligned.jpg" />
        </div>
        <div class="col">
          <h3>2. Colored Illustration</h3>
          <img src="http://localhost:3000/matrimandir-sequence/02-color-aligned.jpg" />
        </div>
        <div class="col">
          <h3>3. Real Photograph</h3>
          <img src="http://localhost:3000/matrimandir-sequence/03-photo-aligned.jpg" />
        </div>
      </div>
      <div style="text-align: center; margin-top: 10px; font-weight: bold;">Alignment Overlay (Sketch + Color + Photo @ 50% opacity)</div>
      <div class="overlay-box">
        <img src="http://localhost:3000/matrimandir-sequence/01-sketch-aligned.jpg" style="opacity: 1;" />
        <img src="http://localhost:3000/matrimandir-sequence/02-color-aligned.jpg" style="opacity: 0.5;" />
        <img src="http://localhost:3000/matrimandir-sequence/03-photo-aligned.jpg" style="opacity: 0.5;" />
      </div>
    </body>
    </html>
  `);
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'docs/v5/screenshots/alignment/triplet_comparison.png', fullPage: true });
  await browser.close();
  console.log('Saved triplet_comparison.png');
})();
