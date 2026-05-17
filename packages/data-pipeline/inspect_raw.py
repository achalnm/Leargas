"""Prints dimension labels from raw CSO JSON files. Run after scraping."""
import json
from pathlib import Path

for fname in ["housing_rppi.json", "employment_lfs.json"]:
    path = Path("raw") / fname
    if not path.exists():
        print(f"{fname}: not found\n")
        continue
    raw = json.loads(path.read_text(encoding="utf-8"))
    print(f"\n{'='*60}")
    print(f"FILE: {fname}")
    print(f"Dimensions: {raw['id']}")
    print(f"Sizes: {raw['size']}")
    for dim_name in raw["id"]:
        cat = raw["dimension"][dim_name]["category"]
        lbl = cat.get("label", {})
        idx = cat.get("index", {})
        print(f"\n  [{dim_name}] ({len(lbl)} values)")
        items = list(lbl.items())
        for code, label in items[:15]:
            print(f"    {code!r:30} → {label!r}")
        if len(items) > 15:
            print(f"    ... ({len(items)-15} more)")
        # Show last 3 items (latest time period)
        if len(items) > 15:
            print(f"  Last 3:")
            for code, label in items[-3:]:
                print(f"    {code!r:30} → {label!r}")
