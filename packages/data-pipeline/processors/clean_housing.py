import json
from pathlib import Path

RAW_DIR = Path(__file__).parent.parent / "raw"
PROCESSED_DIR = Path(__file__).parent.parent / "processed"
PROCESSED_DIR.mkdir(exist_ok=True)

NATIONAL_BASE = 190_000
DUBLIN_BASE   = 275_000

NATIONAL_CODE = "-"
DUBLIN_CODE   = "05"
RPPI_STAT     = "HPM09C01"


def load_raw(name: str) -> dict:
    path = RAW_DIR / f"{name}.json"
    return json.loads(path.read_text(encoding="utf-8"))


def _build_index(raw: dict) -> dict:
    result = {}
    for dim_name in raw["id"]:
        cat = raw["dimension"][dim_name]["category"]
        lbl = cat.get("label", {})
        raw_idx = cat.get("index", {})
        if isinstance(raw_idx, list):
            code_to_pos = {code: i for i, code in enumerate(raw_idx)}
        elif isinstance(raw_idx, dict):
            code_to_pos = dict(raw_idx)
        else:
            code_to_pos = {code: i for i, code in enumerate(lbl)}
        result[dim_name] = {
            "code_to_pos": code_to_pos,
            "pos_to_code": {v: k for k, v in code_to_pos.items()},
            "label": lbl,
        }
    return result


def _flat_idx(positions: list[int], sizes: list[int]) -> int:
    idx = 0
    for i, pos in enumerate(positions):
        stride = 1
        for s in sizes[i + 1:]:
            stride *= s
        idx += pos * stride
    return idx


def _get_value(values: list, positions: list[int], sizes: list[int]) -> float | None:
    fi = _flat_idx(positions, sizes)
    if fi < len(values) and values[fi] is not None:
        return float(values[fi])
    return None


def extract_time_series(raw: dict) -> list[dict]:
    ids   = raw["id"]
    sizes = raw["size"]
    values = raw.get("value", [])
    idx   = _build_index(raw)

    stat_dim   = next((d for d in ids if "statistic" in d.lower()), None)
    time_dim   = next((d for d in ids if "tlist" in d.lower()), None)
    region_dim = next((d for d in ids if d not in [stat_dim, time_dim]), None)

    if not time_dim or not region_dim:
        print(f"  ERROR: could not identify time/region dimensions in {ids}")
        return []

    stat_axis   = ids.index(stat_dim) if stat_dim else None
    time_axis   = ids.index(time_dim)
    region_axis = ids.index(region_dim)

    stat_pos    = idx[stat_dim]["code_to_pos"].get(RPPI_STAT, 0) if stat_dim else 0
    nat_pos     = idx[region_dim]["code_to_pos"].get(NATIONAL_CODE)
    dub_pos     = idx[region_dim]["code_to_pos"].get(DUBLIN_CODE)

    print(f"  stat_pos={stat_pos}, nat_pos={nat_pos}, dub_pos={dub_pos}")

    if nat_pos is None and dub_pos is None:
        print("  WARNING: national/Dublin codes not found. Available codes:",
              list(idx[region_dim]["code_to_pos"].keys())[:8])
        return []

    yearly: dict[int, dict] = {}

    for t_pos, t_code in idx[time_dim]["pos_to_code"].items():
        try:
            year = int(str(t_code)[:4])
            if year < 1990 or year > 2100:
                continue
        except (ValueError, TypeError):
            continue

        def read(region_pos: int) -> float | None:
            positions = [0] * len(ids)
            if stat_axis is not None:
                positions[stat_axis] = stat_pos
            positions[time_axis]   = t_pos
            positions[region_axis] = region_pos
            return _get_value(values, positions, sizes)

        nat_val = read(nat_pos) if nat_pos is not None else None
        dub_val = read(dub_pos) if dub_pos is not None else None

        if nat_val is not None or dub_val is not None:
            yearly[year] = {
                "nationalIndex": nat_val,
                "dublinIndex":   dub_val,
            }

    records = []
    for year in sorted(yearly.keys()):
        entry = yearly[year]
        nat_idx = entry["nationalIndex"]
        dub_idx = entry["dublinIndex"]
        records.append({
            "year": year,
            "nationalMedianPrice": round(NATIONAL_BASE * nat_idx / 100) if nat_idx else None,
            "dublinMedianPrice":   round(DUBLIN_BASE   * dub_idx / 100) if dub_idx else None,
            "nationalRppiIndex":   round(nat_idx, 1) if nat_idx else None,
            "dublinRppiIndex":     round(dub_idx, 1) if dub_idx else None,
        })

    return records


def main():
    print("=== Housing Processor ===")
    try:
        raw = load_raw("housing_rppi")
        time_series = extract_time_series(raw)

        ts_path = PROCESSED_DIR / "housing_time_series.json"
        ts_path.write_text(json.dumps(time_series, indent=2), encoding="utf-8")
        print(f"  Saved {len(time_series)} time-series records -> {ts_path}")
        if time_series:
            print(f"  Earliest: {time_series[0]}")
            print(f"  Latest:   {time_series[-1]}")

        co_path = PROCESSED_DIR / "housing_by_county.json"
        co_path.write_text("[]", encoding="utf-8")

    except FileNotFoundError:
        print("  ERROR: raw/housing_rppi.json not found. Run cso_scraper.py first.")
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"  ERROR: {e}")
    print("Done.")


if __name__ == "__main__":
    main()
