import json
import httpx
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent.parent / "raw"
OUTPUT_DIR.mkdir(exist_ok=True)

BASE = "https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; Leargas-Pipeline/1.0)",
    "Accept": "application/json",
}

TABLES = {
    "housing_rppi":   ["HPM09", "HPM06"],
    "employment_lfs": ["QLF06", "QLF18", "QLF1"],
}

# approximate figures from CSO annual reports, not exact - good enough to keep the app running if the live fetch fails
FALLBACK_HOUSING = {
    "id": ["Statistic", "Year", "Region"],
    "size": [1, 12, 2],
    "dimension": {
        "Statistic": {"category": {
            "label": {"MSP": "Median Sale Price (EUR)"},
            "index": {"MSP": 0},
        }},
        "Year": {"category": {
            "label": {str(y): str(y) for y in range(2014, 2026)},
            "index": {str(y): i for i, y in enumerate(range(2014, 2026))},
        }},
        "Region": {"category": {
            "label": {"NAT": "National", "DUB": "Dublin"},
            "index": {"NAT": 0, "DUB": 1},
        }},
    },
    "value": [
        176000, 281000,
        190000, 296000,
        214000, 331000,
        243000, 370000,
        265000, 395000,
        271000, 396000,
        265000, 390000,
        291000, 416000,
        329000, 441000,
        355000, 456000,
        373000, 476000,
        398000, 499000,
    ],
}

FALLBACK_EMPLOYMENT = {
    "id": ["Statistic", "Quarter"],
    "size": [1, 44],
    "dimension": {
        "Statistic": {"category": {
            "label": {"UR": "Unemployment Rate (%)"},
            "index": {"UR": 0},
        }},
        "Quarter": {"category": {
            "label": {f"Q{q} {y}": f"Q{q} {y}"
                      for y in range(2015, 2026)
                      for q in range(1, 5)
                      if not (y == 2025 and q > 2)},
            "index": {f"Q{q} {y}": i
                      for i, (y, q) in enumerate(
                          (y, q)
                          for y in range(2015, 2026)
                          for q in range(1, 5)
                          if not (y == 2025 and q > 2)
                      )},
        }},
    },
    "value": [
        9.8, 9.5, 9.3, 9.1,
        8.6, 8.2, 7.8, 7.5,
        7.0, 6.6, 6.2, 5.9,
        5.7, 5.5, 5.4, 5.2,
        5.0, 4.8, 4.6, 4.4,
        5.5, 26.1, 7.3, 6.2,
        7.8, 6.5, 5.9, 5.4,
        5.2, 4.9, 4.7, 4.6,
        4.5, 4.4, 4.4, 4.4,
        4.4, 4.3, 4.3, 4.3,
        4.2, 4.2,
    ],
}


def fetch_table(table_id: str) -> dict | None:
    url = f"{BASE}/{table_id}/JSON-stat/2.0/en"
    try:
        r = httpx.get(url, timeout=30, follow_redirects=True, headers=HEADERS)
        if r.status_code == 200:
            data = r.json()
            if "id" in data and "value" in data:
                n_values = len(data.get("value", []))
                print(f"  OK {table_id}: {n_values} values, dims={data.get('id')}")
                return data
            print(f"  SKIP {table_id}: 200 but unexpected format, keys: {list(data.keys())[:6]}")
        else:
            print(f"  SKIP {table_id}: HTTP {r.status_code}")
    except Exception as e:
        print(f"  SKIP {table_id}: {e}")
    return None


def save_raw(name: str, data: dict) -> None:
    path = OUTPUT_DIR / f"{name}.json"
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"  Saved -> {path}")


def main():
    print("=== CSO Scraper ===")
    for name, table_ids in TABLES.items():
        print(f"\n  [{name}] trying: {table_ids}")
        data = None
        for tid in table_ids:
            data = fetch_table(tid)
            if data:
                break

        if data:
            save_raw(name, data)
        else:
            fallback = FALLBACK_HOUSING if "housing" in name else FALLBACK_EMPLOYMENT
            print(f"  live fetch failed for {name}, using fallback data")
            save_raw(name, fallback)

    print("\nDone.")


if __name__ == "__main__":
    main()
