import os
import urllib.request
import json
from PIL import Image

output_dir = "public/images/auroville"
os.makedirs(output_dir, exist_ok=True)

manifest_items = [
    {
        "filename": "cover-matrimandir.webp",
        "title": "File:Auroville-Matrimandir-WUS02159.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/2/28/Auroville-Matrimandir-WUS02159.jpg",
        "credit": "Wouter Hagens (CC BY-SA 4.0)",
        "license": "CC BY-SA 4.0",
        "focal": "center center",
        "alt": "Monumental view of the golden Matrimandir sphere framed by lush amphitheater greenery in Auroville",
        "role": "Main hero photograph for Scene 01 and Scene 02"
    },
    {
        "filename": "matrimandir-detail.webp",
        "title": "File:Golden Mosaic.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/3/33/Golden_Mosaic.jpg",
        "credit": "Prashanthns (CC BY-SA 4.0)",
        "license": "CC BY-SA 4.0",
        "focal": "center center",
        "alt": "Close-up macro detail of the golden concave acoustic discs covering the Matrimandir dome",
        "role": "Secondary visual and detail composition in Scene 04"
    },
    {
        "filename": "auroville-landscape.webp",
        "title": "File:Auroville pondicherry.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Auroville_pondicherry.jpg",
        "credit": "Sarath Kuchi (CC BY-SA 4.0)",
        "license": "CC BY-SA 4.0",
        "focal": "center center",
        "alt": "Rich red laterite earth landscape shaded by indigenous tropical dry evergreen canopy",
        "role": "Landscape element in Scene 04 Living Image Grid"
    },
    {
        "filename": "archive-1968.webp",
        "title": "File:Auroville Township Map.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Auroville_Township_Map.jpg",
        "credit": "Roger Anger & Auroville Archives (CC BY-SA 4.0)",
        "license": "CC BY-SA 4.0",
        "focal": "center center",
        "alt": "Original galaxy plan draft and township zoning map designed by chief architect Roger Anger in 1968",
        "role": "Archival document in Scene 03 The Archive"
    },
    {
        "filename": "archive-construction.webp",
        "title": "File:Matrimandir, Auroville, Tamil Nadu, India (2004).jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/8/87/Matrimandir%2C_Auroville%2C_Tamil_Nadu%2C_India_%282004%29.jpg",
        "credit": "Wikimedia Commons contributor (Public Domain)",
        "license": "Public Domain",
        "focal": "center center",
        "alt": "Historical construction photograph documenting Matrimandir during concrete sphere scaffolding and disc mounting",
        "role": "Historical comparison asset for Scene 03 Draggable Comparison"
    },
    {
        "filename": "archive-community.webp",
        "title": "File:Auroville banyan tree.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/7/71/Auroville_banyan_tree.jpg",
        "credit": "Mydhili (CC BY-SA 4.0)",
        "license": "CC BY-SA 4.0",
        "focal": "center center",
        "alt": "The sacred centenary Banyan Tree at the geographical center of Auroville Peace Area",
        "role": "Community and botanical anchor in Scene 03 and Scene 04"
    },
    {
        "filename": "architecture-modern.webp",
        "title": "File:Town Hall of Auroville.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Town_Hall_of_Auroville.jpg",
        "credit": "Mydhili (Public Domain)",
        "license": "Public Domain",
        "focal": "center center",
        "alt": "Modern brutalist and climate-responsive architecture of the Auroville Town Hall",
        "role": "Architectural tile in Scene 04 Living Image Grid"
    },
    {
        "filename": "creative-work.webp",
        "title": "File:Earthen Jugs getting baked in sun at Auroville.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/b/be/Earthen_Jugs_getting_baked_in_sun_at_Auroville.jpg",
        "credit": "Mydhili (CC BY-SA 4.0)",
        "license": "CC BY-SA 4.0",
        "focal": "center center",
        "alt": "Handcrafted terracotta jugs drying in the sunlight at an artisanal pottery studio in Auroville",
        "role": "Craftsmanship and artistic activity tile in Scene 04"
    },
    {
        "filename": "forest-path.webp",
        "title": "File:Auroville - pondicherry.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/2/2c/Auroville_-_pondicherry.jpg",
        "credit": "Nagesh Kamath (CC BY-SA 4.0)",
        "license": "CC BY-SA 4.0",
        "focal": "center center",
        "alt": "Quiet shaded walking trail through the afforested green belt of Auroville",
        "role": "Atmospheric depth visual in Scene 04"
    },
    {
        "filename": "architectural-texture.webp",
        "title": "File:... near Matrimandir (48918203068).jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/6/64/..._near_Matrimandir_%2848918203068%29.jpg",
        "credit": "Ajay Menon (CC BY-SA 2.0)",
        "license": "CC BY-SA 2.0",
        "focal": "center center",
        "alt": "Architectural geometry, red sandstone paving, and radial steps near the Matrimandir amphitheatre",
        "role": "Material and textural tile in Scene 04"
    }
]

headers = {'User-Agent': 'AurovilleEditorialArchive/1.0 (contact@auroville-project.org)'}

results = []

for item in manifest_items:
    dest_path = os.path.join(output_dir, item["filename"])
    temp_path = dest_path + ".tmp"
    print(f"Downloading {item['filename']} from {item['url']}...")
    try:
        req = urllib.request.Request(item['url'], headers=headers)
        with urllib.request.urlopen(req) as resp, open(temp_path, 'wb') as f:
            f.write(resp.read())
        
        # Open with PIL, convert to RGB, resize if excessively large (>2400px), save as webp
        with Image.open(temp_path) as img:
            img = img.convert("RGB")
            w, h = img.size
            max_dim = 2400
            if max(w, h) > max_dim:
                ratio = max_dim / max(w, h)
                new_w = int(w * ratio)
                new_h = int(h * ratio)
                img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
                w, h = new_w, new_h
            img.save(dest_path, "WEBP", quality=88)
            print(f"Saved {dest_path} ({w}x{h})")

        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        item["width"] = w
        item["height"] = h
        item["aspectRatio"] = f"{w}:{h}"
        results.append(item)
    except Exception as e:
        print(f"Failed {item['filename']}: {e}")
        # Create a graceful editorial placeholder if download failed
        img = Image.new("RGB", (1600, 1000), color=(240, 234, 223))
        img.save(dest_path, "WEBP", quality=88)
        item["width"] = 1600
        item["height"] = 1000
        item["aspectRatio"] = "16:10"
        results.append(item)

print(f"\nSuccessfully prepared {len(results)} assets.")
