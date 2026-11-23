import urllib.request
import urllib.parse
import json
import os

os.makedirs("public/images/auroville", exist_ok=True)

queries = [
    'Matrimandir',
    'Matrimandir amphitheatre',
    'Auroville',
    'Auroville banyan tree',
    'Auroville architecture',
    'Bharat Nivas Auroville',
    'Auroville red soil'
]

results = []

for q in queries:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size|mime|extmetadata"
    req = urllib.request.Request(url, headers={'User-Agent': 'AurovilleEditorial/1.0 (contact@auroville-project.org)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for k, v in pages.items():
                info = v.get('imageinfo', [{}])[0]
                if not info.get('url'):
                    continue
                mime = info.get('mime', '')
                if 'image' not in mime or 'svg' in mime:
                    continue
                meta = info.get('extmetadata', {})
                artist = meta.get('Artist', {}).get('value', 'Unknown')
                license_name = meta.get('LicenseShortName', {}).get('value', 'CC BY-SA')
                desc = meta.get('ImageDescription', {}).get('value', '')
                results.append({
                    "title": v.get('title'),
                    "url": info.get('url'),
                    "width": info.get('width'),
                    "height": info.get('height'),
                    "artist": artist,
                    "license": license_name,
                    "query": q
                })
    except Exception as e:
        print(f"Error querying {q}: {e}")

print(f"Found {len(results)} images.")
for r in results[:15]:
    print(r["title"], r["width"], r["height"], r["license"], r["url"])
