import sys
import time
import argparse
from pathlib import Path


def step(msg: str) -> None:
    print(f"\n{'='*60}")
    print(f"  {msg}")
    print(f"{'='*60}")


def run_cso_scraper() -> bool:
    step("Step 1/4: Scraping CSO PxStat (housing & employment)")
    from scrapers.cso_scraper import main as scrape_cso
    try:
        scrape_cso()
        return True
    except Exception as e:
        print(f"  ERROR in CSO scraper: {e}")
        return False


def run_weather_scraper() -> bool:
    step("Step 2/4: Scraping Met Eireann (climate data)")
    from scrapers.weather_scraper import main as scrape_weather
    try:
        scrape_weather()
        return True
    except Exception as e:
        print(f"  ERROR in weather scraper: {e}")
        return False


def run_housing_processor() -> bool:
    step("Step 3a/4: Processing housing data")
    from processors.clean_housing import main as process_housing
    try:
        process_housing()
        return True
    except Exception as e:
        print(f"  ERROR in housing processor: {e}")
        return False


def run_employment_processor() -> bool:
    step("Step 3b/4: Processing employment data")
    from processors.clean_employment import main as process_employment
    try:
        process_employment()
        return True
    except Exception as e:
        print(f"  ERROR in employment processor: {e}")
        return False


def run_firestore_push() -> bool:
    step("Step 4/4: Pushing to Firestore")
    from ingest.push_to_firestore import main as push
    try:
        push()
        return True
    except Exception as e:
        print(f"  ERROR in Firestore push: {e}")
        return False


def main() -> None:
    parser = argparse.ArgumentParser(description="Leargas data pipeline")
    parser.add_argument("--scrape", action="store_true", help="Scrape only, skip push")
    parser.add_argument("--push", action="store_true", help="Push only, skip scraping")
    args = parser.parse_args()

    import os
    os.chdir(Path(__file__).parent)

    start = time.time()
    errors = []

    if not args.push:
        if not run_cso_scraper():
            errors.append("CSO scraper")
        if not run_weather_scraper():
            errors.append("Weather scraper")
        if not run_housing_processor():
            errors.append("Housing processor")
        if not run_employment_processor():
            errors.append("Employment processor")

    if not args.scrape:
        if not run_firestore_push():
            errors.append("Firestore push")

    elapsed = time.time() - start
    print(f"\n{'='*60}")
    if errors:
        print(f"  Pipeline finished with errors in: {', '.join(errors)}")
        print(f"  Elapsed: {elapsed:.1f}s")
        sys.exit(1)
    else:
        print(f"  Pipeline complete! Elapsed: {elapsed:.1f}s")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
