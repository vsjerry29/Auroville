"""
Extracts clean transparent RGBA WebP assets from generated terracotta pottery
illustrations, removes near-white paper backgrounds without eating interior
cream motifs, defringes edges against #FFFFFF, computes convex collision
hulls + normalized dimensions, and emits a preview contact sheet.
"""

from __future__ import annotations

import json
import math
import sys
from collections import deque
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np
from PIL import Image

REPO_ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = REPO_ROOT / "public" / "illustrated" / "footer-pottery"
PREVIEW_PATH = REPO_ROOT / "docs" / "v6" / "footer-pottery" / "pottery_cutouts_check.jpg"
DATA_TS_PATH = REPO_ROOT / "components" / "experience" / "footerPotteryAssets.ts"


def flood_background_mask(rgb: np.ndarray, tol_luma: int = 232, tol_chroma: int = 22) -> np.ndarray:
    """BFS flood-fill from image border over near-white neutral paper pixels."""
    h, w, _ = rgb.shape
    r = rgb[:, :, 0].astype(np.int16)
    g = rgb[:, :, 1].astype(np.int16)
    b = rgb[:, :, 2].astype(np.int16)

    min_c = np.minimum(np.minimum(r, g), b)
    max_c = np.maximum(np.maximum(r, g), b)
    luma = (0.299 * r + 0.587 * g + 0.114 * b)
    # Candidate paper pixel: bright and low saturation
    is_paper = (luma >= tol_luma) & ((max_c - min_c) <= tol_chroma)

    bg = np.zeros((h, w), dtype=bool)
    q: deque[Tuple[int, int]] = deque()

    for x in range(w):
        for y in (0, h - 1):
            if is_paper[y, x] and not bg[y, x]:
                bg[y, x] = True
                q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if is_paper[y, x] and not bg[y, x]:
                bg[y, x] = True
                q.append((y, x))

    while q:
        cy, cx = q.popleft()
        for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
            if 0 <= ny < h and 0 <= nx < w and not bg[ny, nx] and is_paper[ny, nx]:
                bg[ny, nx] = True
                q.append((ny, nx))

    return bg


def keep_main_vessel_component(fg: np.ndarray) -> np.ndarray:
    """Keep the largest connected vessel body plus components within 6px."""
    h, w = fg.shape
    visited = np.zeros((h, w), dtype=bool)
    components: List[Tuple[int, List[Tuple[int, int]]]] = []

    ys, xs = np.where(fg)
    # 8-neighbor connected components via numpy index iteration
    for start_y, start_x in zip(ys.tolist(), xs.tolist()):
        if visited[start_y, start_x]:
            continue
        q = deque([(start_y, start_x)])
        visited[start_y, start_x] = True
        pixels = []
        while q:
            cy, cx = q.popleft()
            pixels.append((cy, cx))
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    if dy == 0 and dx == 0:
                        continue
                    ny, nx = cy + dy, cx + dx
                    if 0 <= ny < h and 0 <= nx < w and fg[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = True
                        q.append((ny, nx))
        components.append((len(pixels), pixels))

    if not components:
        return fg

    components.sort(key=lambda item: item[0], reverse=True)
    main_count = components[0][0]
    cleaned = np.zeros((h, w), dtype=bool)
    # Keep primary vessel and any tiny pencil-line sub-segments >= 1.5% of main area
    for count, pixels in components:
        if count >= max(180, int(main_count * 0.015)):
            for py, px in pixels:
                cleaned[py, px] = True
    return cleaned


def compute_soft_alpha_and_defringe(rgb: np.ndarray, fg: np.ndarray) -> Image.Image:
    """Build smooth anti-aliased RGBA image and unmix #FFFFFF paper halo on border pixels."""
    h, w, _ = rgb.shape
    rgb_f = rgb.astype(np.float32)

    # Identify 1-pixel inner transition ring touching background
    pad_fg = np.pad(fg, 1, mode="constant", constant_values=False)
    neighbor_fg_count = (
        pad_fg[0:h, 0:w].astype(np.int16)
        + pad_fg[0:h, 1 : w + 1].astype(np.int16)
        + pad_fg[0:h, 2 : w + 2].astype(np.int16)
        + pad_fg[1 : h + 1, 0:w].astype(np.int16)
        + pad_fg[1 : h + 1, 2 : w + 2].astype(np.int16)
        + pad_fg[2 : h + 2, 0:w].astype(np.int16)
        + pad_fg[2 : h + 2, 1 : w + 1].astype(np.int16)
        + pad_fg[2 : h + 2, 2 : w + 2].astype(np.int16)
    )

    alpha = np.where(fg, 1.0, 0.0).astype(np.float32)

    # Estimate subpixel coverage from luminance vs white paper along the 1px contour ring
    min_c = np.min(rgb_f, axis=2)
    luma = 0.299 * rgb_f[:, :, 0] + 0.587 * rgb_f[:, :, 1] + 0.114 * rgb_f[:, :, 2]

    edge_ring = fg & (neighbor_fg_count < 8)
    # Only soften pixels that are relatively close to bright white paper
    bright_edge = edge_ring & (luma > 185)
    soft_cov = np.clip((252.0 - min_c) / 72.0, 0.12, 1.0)
    alpha[bright_edge] = np.minimum(alpha[bright_edge], soft_cov[bright_edge])

    # Unmix C_paper=(255,255,255) from semi-transparent contour pixels to prevent white halos
    safe_alpha = np.clip(alpha, 0.12, 1.0)[:, :, None]
    unmixed = rgb_f.copy()
    mask_unmix = edge_ring & (alpha < 0.995)
    for ch in range(3):
        c_in = rgb_f[:, :, ch]
        c_fg = np.clip((c_in - (1.0 - alpha) * 255.0) / safe_alpha[:, :, 0], 0.0, 255.0)
        unmixed[:, :, ch] = np.where(mask_unmix, c_fg, c_in)

    rgba = np.dstack([
        np.clip(unmixed, 0, 255).astype(np.uint8),
        np.clip(alpha * 255.0, 0, 255).astype(np.uint8),
    ])
    return Image.fromarray(rgba, mode="RGBA")


def convex_hull(points: List[Tuple[float, float]]) -> List[Tuple[float, float]]:
    pts = sorted(set(points))
    if len(pts) <= 2:
        return pts

    def cross(o: Tuple[float, float], a: Tuple[float, float], b: Tuple[float, float]) -> float:
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    lower: List[Tuple[float, float]] = []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)

    upper: List[Tuple[float, float]] = []
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)

    return lower[:-1] + upper[:-1]


def reduce_polygon(hull: List[Tuple[float, float]], target_n: int = 12) -> List[Tuple[float, float]]:
    """Iteratively prune vertex adding minimum triangular area until <= target_n."""
    pts = list(hull)
    while len(pts) > target_n:
        min_area = float("inf")
        min_idx = 0
        n = len(pts)
        for i in range(n):
            a = pts[(i - 1) % n]
            b = pts[i]
            c = pts[(i + 1) % n]
            area = abs((a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])) * 0.5)
            if area < min_area:
                min_area = area
                min_idx = i
        pts.pop(min_idx)
    return pts


def extract_normalized_hull(rgba_cropped: Image.Image) -> List[List[float]]:
    """Compute a 12-vertex convex collision hull normalized around image center [-0.5, +0.5]."""
    arr = np.array(rgba_cropped)
    h, w, _ = arr.shape
    mask = arr[:, :, 3] >= 120
    # Sample boundary pixels per scanline and column to keep point count tiny and fast
    pts: List[Tuple[float, float]] = []
    for y in range(h):
        xs = np.where(mask[y])[0]
        if len(xs) > 0:
            pts.append((float(xs[0]), float(y)))
            pts.append((float(xs[-1]), float(y)))
    for x in range(w):
        ys = np.where(mask[:, x])[0]
        if len(ys) > 0:
            pts.append((float(x), float(ys[0])))
            pts.append((float(x), float(ys[-1])))

    hull = reduce_polygon(convex_hull(pts), target_n=12)
    # Inset vertices by 1.5% toward centroid so outlines visually touch on collision
    cx_mean = sum(p[0] for p in hull) / len(hull)
    cy_mean = sum(p[1] for p in hull) / len(hull)

    norm_pts: List[List[float]] = []
    for px, py in hull:
        ix = cx_mean + (px - cx_mean) * 0.985
        iy = cy_mean + (py - cy_mean) * 0.985
        nx = round((ix / w) - 0.5, 4)
        ny = round((iy / h) - 0.5, 4)
        norm_pts.append([nx, ny])
    return norm_pts


def process_assets(spec: Dict[str, str]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    PREVIEW_PATH.parent.mkdir(parents=True, exist_ok=True)

    manifest = []
    cropped_previews: List[Tuple[str, Image.Image]] = []

    for key, src_path_str in spec.items():
        src_path = Path(src_path_str)
        if not src_path.exists():
            raise FileNotFoundError(f"Missing generated source asset: {src_path}")

        im = Image.open(src_path).convert("RGB")
        # Work at max 900px before BFS so extraction runs in under 150ms per image
        if max(im.size) > 900:
            im.thumbnail((900, 900), Image.Resampling.LANCZOS)

        rgb = np.array(im)
        bg = flood_background_mask(rgb)
        fg = keep_main_vessel_component(~bg)
        rgba = compute_soft_alpha_and_defringe(rgb, fg)

        bbox = rgba.getbbox()
        if not bbox:
            raise RuntimeError(f"Empty cutout extracted for {key}")

        pad = 2
        x0 = max(0, bbox[0] - pad)
        y0 = max(0, bbox[1] - pad)
        x1 = min(rgba.width, bbox[2] + pad)
        y1 = min(rgba.height, bbox[3] + pad)
        cropped = rgba.crop((x0, y0, x1, y1))

        # Fit max dimension to 520px for crisp Retina rendering with small payload
        if max(cropped.size) > 520:
            cropped.thumbnail((520, 520), Image.Resampling.LANCZOS)

        out_file = OUT_DIR / f"{key}.webp"
        cropped.save(out_file, format="WEBP", quality=93, method=6)
        hull = extract_normalized_hull(cropped)

        manifest.append({
            "id": key,
            "src": f"/illustrated/footer-pottery/{key}.webp",
            "width": cropped.width,
            "height": cropped.height,
            "hull": hull,
        })
        cropped_previews.append((key, cropped))
        print(f"Processed {key}: {cropped.width}x{cropped.height} -> {out_file}")

    # Build combined visual inspection contact sheet over #FAFAF8 + subtle checker stripe
    cols = 4
    rows = math.ceil(len(cropped_previews) / cols)
    cell = 340
    sheet = Image.new("RGB", (cols * cell, rows * cell), (250, 250, 248))
    for idx, (key, pot_im) in enumerate(cropped_previews):
        r = idx // cols
        c = idx % cols
        ox = c * cell
        oy = r * cell
        # Draw subtle #EFECE4 checkerboard band across middle third to verify alpha transparency
        tile = 18
        for yy in range(oy + 110, oy + 230, tile):
            for xx in range(ox + 20, ox + cell - 20, tile):
                if ((xx // tile) + (yy // tile)) % 2 == 0:
                    for py in range(yy, min(yy + tile, oy + 230)):
                        for px in range(xx, min(xx + tile, ox + cell - 20)):
                            sheet.putpixel((px, py), (235, 231, 221))

        thumb = pot_im.copy()
        thumb.thumbnail((cell - 56, cell - 56), Image.Resampling.LANCZOS)
        px = ox + (cell - thumb.width) // 2
        py = oy + (cell - thumb.height) // 2
        sheet.paste(thumb, (px, py), thumb)

    sheet.save(PREVIEW_PATH, format="JPEG", quality=92)
    print(f"Saved visual inspection sheet: {PREVIEW_PATH}")
    print("MANIFEST_JSON:" + json.dumps(manifest))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python process_pottery_assets.py <spec.json>")
        sys.exit(1)
    spec_data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    process_assets(spec_data)
