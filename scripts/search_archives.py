import urllib.request
import urllib.parse
import json

queries = [
    'Matrimandir construction',
    'Auroville 1968',
    'Auroville inauguration',
    'Auroville Urn',
    'Amphitheatre Auroville',
    'Auroville archives',
    'Auroville historical'
]

for q in queries:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size|mime|extmetadata"
    req = urllib.request.Request(url, headers={'User-Agent': 'AurovilleEditorial/1.0 (contact@auroville-project.org)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            print(f"=== {q} ===")
            for k, v in pages.items():
                info = v.get('imageinfo', [{}])[0]
                meta = info.get('extmetadata', {})
                print(v.get('title'), info.get('width'), info.get('height'), meta.get('LicenseShortName', {}).get('value'), info.get('url'))
    except Exception as e:
        print(f"Error {q}: {e}")
