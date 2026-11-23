import os
from PIL import Image
import numpy as np

os.makedirs("public/art/hero", exist_ok=True)
os.makedirs("public/art/botanical", exist_ok=True)
os.makedirs("public/art/architecture", exist_ok=True)
os.makedirs("public/art/people", exist_ok=True)
os.makedirs("public/art/details", exist_ok=True)

def make_transparent(input_path, output_path, threshold=242):
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)
    r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]
    
    brightness = 0.299 * r + 0.587 * g + 0.114 * b
    
    alpha = np.ones_like(brightness, dtype=np.uint8) * 255
    mask_transparent = brightness >= threshold
    alpha[mask_transparent] = 0
    
    mask_transition = (brightness < threshold) & (brightness > 175)
    alpha[mask_transition] = ((threshold - brightness[mask_transition]) / (threshold - 175) * 255).astype(np.uint8)
    
    data[:, :, 3] = alpha
    result = Image.fromarray(data)
    result.save(output_path, "WEBP", quality=95)
    print(f"Processed transparent artwork to {output_path} ({result.size})")
    return result

# 1. Banyan Tree
banyan_raw = r"C:\Users\SuriyaVS\.gemini\antigravity\brain\70971ea9-e322-466e-8536-ad1c8f3c797b\auroville_banyan_tree_ink_illustration_1795413118453.jpg"
if os.path.exists(banyan_raw):
    make_transparent(banyan_raw, "public/art/botanical/banyan-tree.webp")

# 2. Artisans
artisans_raw = r"C:\Users\SuriyaVS\.gemini\antigravity\brain\70971ea9-e322-466e-8536-ad1c8f3c797b\auroville_artisans_creative_ink_illustration_1795413260789.jpg"
if os.path.exists(artisans_raw):
    art_img = make_transparent(artisans_raw, "public/art/people/artisans-group.webp")
    w, h = art_img.size
    potter = art_img.crop((0, 0, int(w * 0.52), h))
    potter.save("public/art/people/potter.webp", "WEBP", quality=95)
    architect = art_img.crop((int(w * 0.48), 0, w, h))
    architect.save("public/art/people/architect.webp", "WEBP", quality=95)

# 3. Matrimandir Architectural Study
mm_raw = r"C:\Users\SuriyaVS\.gemini\antigravity\brain\70971ea9-e322-466e-8536-ad1c8f3c797b\auroville_matrimandir_architectural_study_1795413437092.jpg"
if os.path.exists(mm_raw):
    make_transparent(mm_raw, "public/art/architecture/matrimandir-study.webp")
    with Image.open(mm_raw) as img:
        img = img.convert("RGB")
        img.save("public/art/architecture/matrimandir-study-card.webp", "WEBP", quality=95)

# 4. Galaxy Plan Concept Sheet
galaxy_raw = r"C:\Users\SuriyaVS\.gemini\antigravity\brain\70971ea9-e322-466e-8536-ad1c8f3c797b\auroville_galaxy_masterplan_architectural_study_1795413591722.jpg"
if os.path.exists(galaxy_raw):
    make_transparent(galaxy_raw, "public/art/architecture/galaxy-plan-transparent.webp")
    with Image.open(galaxy_raw) as img:
        img = img.convert("RGB")
        img.save("public/art/architecture/galaxy-plan.webp", "WEBP", quality=95)
        print("Saved galaxy-plan.webp")

print("All available illustrations processed.")
