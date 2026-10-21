"""Regenerate the bundled web font from Xiaolai v3.126 (fonttools + brotli required)."""
import hashlib
import json
from pathlib import Path
import sys
from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
source = Path(sys.argv[1])
client = (root / "client.template.js").read_text(encoding="utf-8")
# Include every UI label, including Object.assign additions for the wheel and ledger.
text = client[client.index("const DICTIONARIES ="):client.index("// Small, local SVG")]
codepoints = {ord(character) for character in text if ord(character) >= 32} | set(range(32, 127))
font = TTFont(source)
missing = codepoints - set(font.getBestCmap())
if missing:
    raise ValueError(f"Source font misses UI characters: {missing}")
options = subset.Options()
options.flavor = "woff2"
options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14, 16, 17]
options.name_legacy = True
options.name_languages = ["*"]
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes=codepoints)
subsetter.subset(font)
renames = {1: "DSG Greeting Hand", 2: "Regular", 3: "DSG Greeting Hand 1.0", 4: "DSG Greeting Hand Regular", 6: "DSGGreetingHand-Regular", 16: "DSG Greeting Hand", 17: "Regular"}
for record in font["name"].names:
    if record.nameID in renames:
        record.string = renames[record.nameID].encode(record.getEncoding())
font.flavor = "woff2"
target = root / "assets/fonts/greeting-hand.woff2"
font.save(target)
metadata = {"upstream": "https://github.com/lxgw/kose-font", "release": "v3.126", "source": "https://github.com/lxgw/kose-font/releases/download/v3.126/Xiaolai-Regular.ttf", "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest(), "fontFamily": "DSG Greeting Hand", "format": "woff2", "subsetCodepoints": sorted(codepoints), "license": "SIL Open Font License 1.1", "licenseFile": "OFL-Xiaolai.txt"}
(target.parent / "source.json").write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"bytes": target.stat().st_size, "characters": len(codepoints), "family": metadata["fontFamily"]}))
