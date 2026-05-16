import csv
import json
from pathlib import Path

import httpx

OUTPUT_DIR = Path(__file__).parent.parent / "raw"
OUTPUT_DIR.mkdir(exist_ok=True)

MET_EIREANN_URL = "https://clidata.met.ie/cli/climate_data/webdata/mly532.csv"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
               "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

CLIMATE_NORMALS = [
    {"month": 1,  "monthName": "Jan", "avgTemperatureC": 5.7,  "rainfallMm": 71.6,  "sunshinehours": 55.1},
    {"month": 2,  "monthName": "Feb", "avgTemperatureC": 5.9,  "rainfallMm": 52.4,  "sunshinehours": 74.9},
    {"month": 3,  "monthName": "Mar", "avgTemperatureC": 7.8,  "rainfallMm": 57.1,  "sunshinehours": 107.3},
    {"month": 4,  "monthName": "Apr", "avgTemperatureC": 9.9,  "rainfallMm": 53.9,  "sunshinehours": 155.0},
    {"month": 5,  "monthName": "May", "avgTemperatureC": 12.8, "rainfallMm": 59.8,  "sunshinehours": 183.1},
    {"month": 6,  "monthName": "Jun", "avgTemperatureC": 15.4, "rainfallMm": 59.8,  "sunshinehours": 172.9},
    {"month": 7,  "monthName": "Jul", "avgTemperatureC": 17.2, "rainfallMm": 54.5,  "sunshinehours": 158.5},
    {"month": 8,  "monthName": "Aug", "avgTemperatureC": 17.0, "rainfallMm": 71.6,  "sunshinehours": 152.2},
    {"month": 9,  "monthName": "Sep", "avgTemperatureC": 14.3, "rainfallMm": 68.1,  "sunshinehours": 116.7},
    {"month": 10, "monthName": "Oct", "avgTemperatureC": 11.2, "rainfallMm": 76.1,  "sunshinehours": 91.3},
    {"month": 11, "monthName": "Nov", "avgTemperatureC": 7.8,  "rainfallMm": 73.0,  "sunshinehours": 57.8},
    {"month": 12, "monthName": "Dec", "avgTemperatureC": 6.0,  "rainfallMm": 79.5,  "sunshinehours": 45.1},
]


def fetch_monthly_data() -> list[dict]:
    print("  Fetching Met Eireann monthly data (Dublin Airport)...")

    try:
        response = httpx.get(MET_EIREANN_URL, timeout=30, follow_redirects=True, headers=HEADERS)
        response.raise_for_status()
    except Exception as e:
        print(f"  WARNING: Live fetch failed ({e}). Using Met Eireann 1991-2020 climate normals.")
        return CLIMATE_NORMALS

    all_lines = response.text.splitlines()
    start = next((i for i, l in enumerate(all_lines) if l.startswith("year,month")), None)
    if start is None:
        print("  WARNING: Could not find CSV header. Using climate normals.")
        return CLIMATE_NORMALS
    lines = all_lines[start:]

    reader = csv.DictReader(lines)
    monthly_buckets: dict[int, list] = {m: [] for m in range(1, 13)}

    for row in reader:
        try:
            month = int(row.get("month") or 0)
            temp = float(row.get("meant") or row.get("maxtp") or 0)
            rain = float(row.get("rain") or 0)
            sun  = float(row.get("sun") or 0)
            if 1 <= month <= 12 and (temp or rain or sun):
                monthly_buckets[month].append({"temp": temp, "rain": rain, "sun": sun})
        except (ValueError, KeyError):
            continue

    result = []
    for month, entries in monthly_buckets.items():
        if not entries:
            continue
        result.append({
            "month": month,
            "monthName": MONTH_NAMES[month - 1],
            "avgTemperatureC": round(sum(e["temp"] for e in entries) / len(entries), 1),
            "rainfallMm":      round(sum(e["rain"] for e in entries) / len(entries), 1),
            "sunshinehours":   round(sum(e["sun"]  for e in entries) / len(entries), 1),
        })

    if not result:
        print("  WARNING: Could not parse CSV. Using climate normals.")
        return CLIMATE_NORMALS

    print(f"  Parsed {len(result)} months from live data.")
    return sorted(result, key=lambda x: x["month"])


def main():
    print("=== Met Eireann Scraper ===")
    data = fetch_monthly_data()
    output_path = OUTPUT_DIR / "weather_monthly.json"
    output_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"  Saved {len(data)} monthly records -> {output_path}")
    print("Done.")


if __name__ == "__main__":
    main()
