"""
Rebuilds all three Chapter 04 prints as harmonious 1:1 square WebP botanical
plates (`print-red-earth-sq.webp`, `print-seed-hand-sq.webp`,
`print-roots-strata-sq.webp`) while preserving every original artwork detail.
"""

from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

REPO = Path(__file__).resolve().parent.parent
CH04_DIR = REPO / "public" / "illustrated" / "ch04-earth"
SEED_GEN = Path(
    r"C:\Users\SuriyaVS\.gemini\antigravity\brain\70971ea9-e322-466e-8536-ad1c8f3c797b\ch04_sq_seed_hand_jpg_1795855783727.jpg"
)
PREVIEW_PATH = REPO / "docs" / "v6" / "ch04-redesign" / "ch04_square_plates_check.jpg"


def feather_seam_patch(
    base: np.ndarray,
    patch: np.ndarray,
    paste_x0: int,
    paste_y0: int,
    blend_w: int = 34,
    from_left: bool = True,
) -> None:
    """Blends `patch` smoothly into `base` horizontally over `blend_w` pixels."""
    ph, pw, _ = patch.shape
    mask_x = np.ones(pw, dtype=np.float32)
    if from_left:
        # Seam is at the right edge of patch (adjacent to center artwork left edge)
        ramp = np.linspace(1.0, 0.0, blend_w, dtype=np.float32)
        mask_x[-blend_w:] = 0.5 * (1.0 - np.cos(np.pi * ramp))
    else:
        # Seam is at the left edge of patch (adjacent to center artwork right edge)
        ramp = np.linspace(0.0, 1.0, blend_w, dtype=np.float32)
        mask_x[:blend_w] = 0.5 * (1.0 - np.cos(np.pi * ramp))

    alpha = np.tile(mask_x[None, :, None], (ph, 1, 3))
    roi = base[paste_y0 : paste_y0 + ph, paste_x0 : paste_x0 + pw].astype(np.float32)
    blended = roi * (1.0 - alpha) + patch.astype(np.float32) * alpha
    base[paste_y0 : paste_y0 + ph, paste_x0 : paste_x0 + pw] = np.clip(blended, 0, 255).astype(np.uint8)


def build_red_earth_square(size: int = 800) -> Image.Image:
    src = np.array(Image.open(CH04_DIR / "print-red-earth.webp").convert("RGB"))
    # Inner strata block inside deckled margins: x [90..482], y [82..742] -> 392 x 660
    core = src[82:742, 90:482]
    ch, cw, _ = core.shape

    # Scale vertically cleanly to match 748 inner square height (preserving aspect of geology layers cleanly!)
    inner = 748
    scale = inner / ch
    scaled_w = round(cw * scale)
    core_im = Image.fromarray(core).resize((scaled_w, inner), Image.Resampling.LANCZOS)
    core_arr = np.array(core_im)

    canvas = np.full((inner, inner, 3), 245, dtype=np.uint8)
    cx = (inner - scaled_w) // 2
    canvas[:, cx : cx + scaled_w] = core_arr

    # Non-mirrored opposite-side geological wrap preserves directional pencil stroke light without Rorschach symmetry
    left_w = cx + 24
    left_strip = core_arr[:, scaled_w - left_w - 8 : scaled_w - 8]
    feather_seam_patch(canvas, left_strip, 0, 0, blend_w=26, from_left=True)

    right_w = inner - (cx + scaled_w) + 24
    right_x0 = inner - right_w
    right_strip = core_arr[:, 10 : 10 + right_w]
    feather_seam_patch(canvas, right_strip, right_x0, 0, blend_w=26, from_left=False)

    # Mount cleanly inside crisp thin archival parchment + graphite hairline frame (matching Taproot & Seed plates)
    out = Image.new("RGB", (size, size), (249, 246, 238))
    pad = (size - inner) // 2
    out.paste(Image.fromarray(canvas), (pad, pad))
    draw = ImageDraw.Draw(out)
    draw.rectangle([pad - 1, pad - 1, pad + inner, pad + inner], outline=(76, 68, 56), width=2)
    return out


def build_roots_square(size: int = 800) -> Image.Image:
    src = np.array(Image.open(CH04_DIR / "print-roots-strata.webp").convert("RGB"))
    # Ink frame of original is roughly x: 34..534 (500px), y: 28..815 (787px)
    core = src[32:810, 36:532]
    ch, cw, _ = core.shape

    inner = 748
    scale = inner / ch
    scaled_w = round(cw * scale)
    core_arr = np.array(Image.fromarray(core).resize((scaled_w, inner), Image.Resampling.LANCZOS))

    canvas = np.full((inner, inner, 3), 249, dtype=np.uint8)
    cx = (inner - scaled_w) // 2
    canvas[:, cx : cx + scaled_w] = core_arr

    # Non-mirrored left soil strata extension keeping exact band horizons & subtle blend right at seam
    left_w = cx + 14
    left_strip = core_arr[:, 32 : 32 + left_w]
    feather_seam_patch(canvas, left_strip, 0, 0, blend_w=16, from_left=True)

    # Non-mirrored right soil strata extension strictly outside the inset macro box border (inset border untouched)
    right_w = inner - (cx + scaled_w) + 6
    right_x0 = inner - right_w
    right_strip = core_arr[:, 4 : 4 + right_w]
    feather_seam_patch(canvas, right_strip, right_x0, 0, blend_w=10, from_left=False)

    out = Image.new("RGB", (size, size), (249, 246, 238))
    pad = (size - inner) // 2
    out.paste(Image.fromarray(canvas), (pad, pad))
    draw = ImageDraw.Draw(out)
    draw.rectangle([pad - 1, pad - 1, pad + inner, pad + inner], outline=(76, 68, 56), width=2)
    return out


def build_seed_square(size: int = 800) -> Image.Image:
    im = Image.open(SEED_GEN).convert("RGB").resize((size, size), Image.Resampling.LANCZOS)
    # Add cohesive hairline archival frame matching the 3-print botanical plate family
    inner = 748
    pad = (size - inner) // 2
    inner_im = im.resize((inner, inner), Image.Resampling.LANCZOS)
    out = Image.new("RGB", (size, size), (249, 246, 238))
    out.paste(inner_im, (pad, pad))
    draw = ImageDraw.Draw(out)
    draw.rectangle([pad - 1, pad - 1, pad + inner, pad + inner], outline=(76, 68, 56), width=2)
    return out


def main() -> None:
    CH04_DIR.mkdir(parents=True, exist_ok=True)
    PREVIEW_PATH.parent.mkdir(parents=True, exist_ok=True)

    plates = [
        ("print-red-earth-sq.webp", build_red_earth_square(800)),
        ("print-seed-hand-sq.webp", build_seed_square(800)),
        ("print-roots-strata-sq.webp", build_roots_square(800)),
    ]

    sheet = Image.new("RGB", (1320, 460), (246, 243, 235))
    for idx, (fname, img) in enumerate(plates):
        out_path = CH04_DIR / fname
        img.save(out_path, format="WEBP", quality=92, method=6)
        thumb = img.resize((400, 400), Image.Resampling.LANCZOS)
        sheet.paste(thumb, (30 + idx * 430, 30))
        print(f"Saved {out_path} ({img.size[0]}x{img.size[1]})")

    sheet.save(PREVIEW_PATH, format="JPEG", quality=92)
    print(f"Saved preview: {PREVIEW_PATH}")


if __name__ == "__main__":
    main()
