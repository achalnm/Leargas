import json
import re
from pathlib import Path

RAW_DIR = Path(__file__).parent.parent / "raw"
PROCESSED_DIR = Path(__file__).parent.parent / "processed"
PROCESSED_DIR.mkdir(exist_ok=True)

EU_AVERAGES: dict[int, float] = {
    2015: 10.2, 2016: 9.6,  2017: 8.8,  2018: 8.2,  2019: 7.6,
    2020: 8.1,  2021: 8.4,  2022: 7.2,  2023: 6.8,  2024: 6.5,
    2025: 6.3,
}

STAT_CODE   = "QLF06S1"
SEX_CODE    = "-"
UNEMP_CODE  = "07"
INLF_CODE   = "01"


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


def _parse_tlist_quarter(code: str) -> tuple[int, str] | None:
    code = str(code).strip()

    m = re.match(r'^(\d{4})(\d)$', code)
    if m:
        year, q = int(m.group(1)), int(m.group(2))
        if 1 <= q <= 4:
            return year, f"Q{q}"

    m = re.search(r'Q(\d)\s*(\d{4})', code, re.IGNORECASE)
    if m:
        return int(m.group(2)), f"Q{m.group(1)}"
    m = re.search(r'(\d{4})\s*Q(\d)', code, re.IGNORECASE)
    if m:
        return int(m.group(1)), f"Q{m.group(2)}"

    return None


def extract_time_series(raw: dict) -> list[dict]:
    ids    = raw["id"]
    sizes  = raw["size"]
    values = raw.get("value", [])
    idx    = _build_index(raw)

    time_dim   = next((d for d in ids if "tlist" in d.lower()), None)
    stat_dim   = next((d for d in ids if "statistic" in d.lower()), None)
    sex_dim    = next((d for d in ids if d not in [time_dim, stat_dim]
                       and idx[d]["code_to_pos"].get(SEX_CODE) is not None), None)
    status_dim = next((d for d in ids if d not in [time_dim, stat_dim, sex_dim]
                       and idx[d]["code_to_pos"].get(UNEMP_CODE) is not None), None)

    if not sex_dim or not status_dim:
        other_dims = [d for d in ids if d not in [time_dim, stat_dim]]
        if len(other_dims) >= 2:
            sex_dim    = sex_dim    or other_dims[0]
            status_dim = status_dim or other_dims[1]
        elif len(other_dims) == 1:
            status_dim = status_dim or other_dims[0]

    print(f"  Dimensions: {ids}")
    print(f"  time={time_dim}, stat={stat_dim}, sex={sex_dim}, status={status_dim}")

    if not time_dim or not status_dim:
        print("  ERROR: could not identify required dimensions")
        return []

    time_axis   = ids.index(time_dim)
    stat_axis   = ids.index(stat_dim)   if stat_dim   else None
    sex_axis    = ids.index(sex_dim)    if sex_dim    else None
    status_axis = ids.index(status_dim)

    stat_pos   = idx[stat_dim]["code_to_pos"].get(STAT_CODE, 0)   if stat_dim   else 0
    sex_pos    = idx[sex_dim]["code_to_pos"].get(SEX_CODE, 0)     if sex_dim    else 0
    unemp_pos  = idx[status_dim]["code_to_pos"].get(UNEMP_CODE)
    inlf_pos   = idx[status_dim]["code_to_pos"].get(INLF_CODE)

    print(f"  stat_pos={stat_pos}, sex_pos={sex_pos}, unemp_pos={unemp_pos}, inlf_pos={inlf_pos}")

    if unemp_pos is None or inlf_pos is None:
        print("  ERROR: unemployed/labour-force codes not found. Available:",
              list(idx[status_dim]["code_to_pos"].keys()))
        return []

    def read(t_pos: int, status_pos: int) -> float | None:
        positions = [0] * len(ids)
        if stat_axis is not None:
            positions[stat_axis] = stat_pos
        positions[time_axis] = t_pos
        if sex_axis is not None:
            positions[sex_axis] = sex_pos
        positions[status_axis] = status_pos
        return _get_value(values, positions, sizes)

    records = []
    seen = set()

    for t_pos, t_code in idx[time_dim]["pos_to_code"].items():
        parsed = _parse_tlist_quarter(t_code)
        if not parsed:
            continue
        year, quarter = parsed
        if year < 1990 or year > 2100:
            continue

        key = (year, quarter)
        if key in seen:
            continue

        unemployed = read(t_pos, unemp_pos)
        in_labour  = read(t_pos, inlf_pos)

        if unemployed is not None and in_labour is not None and in_labour > 0:
            rate = round(unemployed / in_labour * 100, 1)
            seen.add(key)
            records.append({
                "year":             year,
                "quarter":          quarter,
                "unemploymentRate": rate,
                "euAverageRate":    EU_AVERAGES.get(year),
            })

    return sorted(records, key=lambda r: (r["year"], r["quarter"]))


def main():
    print("=== Employment Processor ===")
    try:
        raw = load_raw("employment_lfs")
        time_series = extract_time_series(raw)

        out_path = PROCESSED_DIR / "employment_time_series.json"
        out_path.write_text(json.dumps(time_series, indent=2), encoding="utf-8")
        print(f"  Saved {len(time_series)} records -> {out_path}")
        if time_series:
            print(f"  Earliest: {time_series[0]}")
            print(f"  Latest:   {time_series[-1]}")
    except FileNotFoundError:
        print("  ERROR: raw/employment_lfs.json not found. Run cso_scraper.py first.")
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"  ERROR: {e}")
    print("Done.")


if __name__ == "__main__":
    main()
