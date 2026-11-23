import os
from PIL import Image
import numpy as np

def make_transparent(input_path, output_path, threshold=240):
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)
    r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]
    brightness = 0.299 * r + 0.587 * g + 0.114 * b
    
    alpha = np.ones_like(brightness, dtype=np.uint8) * 255
    mask_transparent = brightness >= threshold
    alpha[mask_transparent] = 0
    mask_transition = (brightness < threshold) & (brightness > 170)
    alpha[mask_transition] = ((threshold - brightness[mask_transition]) / (threshold - 170) * 255).astype(np.uint8)
    
    data[:, :, 3] = alpha
    result = Image.fromarray(data)
    result.save(output_path, "WEBP", quality=95)
    return result

details_raw = r"C:\Users\SuriyaVS\.gemini\antigravity\brain\70971ea9-e322-466e-8536-ad1c8f3c797b\auroville_botanical_architectural_details_sheet_1795413734806.jpg"
if os.path.exists(details_raw):
    det_img = make_transparent(details_raw, "public/art/details/details-sheet.webp")
    w, h = det_img.size
    
    # 1. Leaf rosette (top-left: x 0 to 0.35 * w, y 0.08 * h to 0.52 * h)
    leaf_rosette = det_img.crop((int(0.02 * w), int(0.08 * h), int(0.35 * w), int(0.52 * h)))
    leaf_rosette.save("public/art/details/leaf-rosette.webp", "WEBP", quality=95)
    print("Saved leaf-rosette.webp")
    
    # 2. Aerial roots (top-center: x 0.36 * w to 0.70 * w, y 0.08 * h to 0.52 * h)
    aerial_roots = det_img.crop((int(0.36 * w), int(0.08 * h), int(0.70 * w), int(0.52 * h)))
    aerial_roots.save("public/art/details/aerial-roots.webp", "WEBP", quality=95)
    print("Saved aerial-roots.webp")
    
    # 3. Neem branch (top-right: x 0.72 * w to 0.98 * w, y 0.08 * h to 0.52 * h)
    neem_branch = det_img.crop((int(0.72 * w), int(0.08 * h), int(0.98 * w), int(0.52 * h)))
    neem_branch.save("public/art/details/neem-branch.webp", "WEBP", quality=95)
    print("Saved neem-branch.webp")
    
    # 4. Protractor / compass (bottom-left: x 0.02 * w to 0.35 * w, y 0.68 * h to 0.98 * h)
    protractor = det_img.crop((int(0.02 * w), int(0.68 * h), int(0.35 * w), int(0.98 * h)))
    protractor.save("public/art/details/protractor.webp", "WEBP", quality=95)
    print("Saved protractor.webp")

print("Details cropped and saved.")
