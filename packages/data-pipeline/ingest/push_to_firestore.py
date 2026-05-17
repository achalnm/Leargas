import json
import os
from pathlib import Path
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
from tqdm import tqdm

load_dotenv()

BASE_DIR = Path(__file__).parent.parent
PROCESSED_DIR = BASE_DIR / "processed"
RAW_DIR = BASE_DIR / "raw"

SERVICE_ACCOUNT_PATH = os.getenv(
    "FIREBASE_SERVICE_ACCOUNT_PATH",
    str(BASE_DIR / "service-account.json"),
)


def _make_doc_id(record: dict, i: int) -> str:
    if "year" in record and "quarter" in record and record["quarter"] != "Annual":
        return f"{record['year']}_{record['quarter']}"
    if "year" in record:
        return str(record["year"])
    if "county" in record:
        return record["county"].lower().replace(" ", "-")
    if "month" in record:
        return str(record["month"])
    return str(i)


def init_firebase() -> firestore.Client:
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
    return firestore.client()


def push_collection(db: firestore.Client, collection_name: str, data_path: Path) -> None:
    if not data_path.exists():
        print(f"  SKIP {collection_name}: {data_path} not found")
        return

    records = json.loads(data_path.read_text(encoding="utf-8"))
    if not records:
        print(f"  SKIP {collection_name}: no records in {data_path.name}")
        return

    print(f"  Pushing {len(records)} records to '{collection_name}'...")
    col_ref = db.collection(collection_name)
    batch = db.batch()
    batch_size = 0

    for i, record in enumerate(tqdm(records, desc=f"  {collection_name}", unit="doc")):
        doc_id = _make_doc_id(record, i)
        batch.set(col_ref.document(doc_id), record)
        batch_size += 1

        if batch_size == 500:
            batch.commit()
            batch = db.batch()
            batch_size = 0

    if batch_size > 0:
        batch.commit()

    print(f"  Done -> '{collection_name}'")


COLLECTIONS: list[tuple[str, Path]] = [
    ("housingTimeSeries",    PROCESSED_DIR / "housing_time_series.json"),
    ("housingByCounty",      PROCESSED_DIR / "housing_by_county.json"),
    ("employmentTimeSeries", PROCESSED_DIR / "employment_time_series.json"),
    ("weatherMonthly",       RAW_DIR / "weather_monthly.json"),
]


def main() -> None:
    print("=== Firestore Ingestion ===")
    print(f"  Service account: {SERVICE_ACCOUNT_PATH}")

    if not Path(SERVICE_ACCOUNT_PATH).exists():
        print(
            "\n  ERROR: Service account key not found.\n"
            "  Download from Firebase Console -> Project Settings -> Service Accounts\n"
            f"  and save as: {SERVICE_ACCOUNT_PATH}\n"
        )
        return

    db = init_firebase()

    for collection_name, data_path in COLLECTIONS:
        try:
            push_collection(db, collection_name, data_path)
        except Exception as e:
            print(f"  ERROR pushing {collection_name}: {e}")

    print("\nIngestion complete.")


if __name__ == "__main__":
    main()
