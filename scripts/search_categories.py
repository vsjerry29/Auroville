import urllib.request
import urllib.parse
import json

for cat in ['Category:Matrimandir', 'Category:Auroville']:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=categorymembers&gcmtitle={urllib.parse.quote(cat)}&gcmnamespace=6&gcmlimit=30&prop=imageinfo&iiprop=url|size|mime|extmetadata"
    req = urllib.request.Request(url, headers={'User-Agent': 'AurovilleEditorial/1.0 (contact@auroville-project.org)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            print(f"=== {cat} ({len(pages)} images) ===")
            for k, v in pages.items():
                info = v.get('imageinfo', [{}])[0]
                meta = info.get('extmetadata', {})
                print(v.get('title'), info.get('width'), info.get('height'), meta.get('LicenseShortName', {}).get('value'), info.get('url'))
    except Exception as e:
        print(f"Error {cat}: {e}")
