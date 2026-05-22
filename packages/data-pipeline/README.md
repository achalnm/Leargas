# Léargas Data Pipeline

Python scripts that fetch Irish public data, clean it, and push it to Firestore.

## Setup

```bash
cd packages/data-pipeline
pip install -r requirements.txt
```

Download your Firebase service account key from:
`Firebase Console -> Project Settings -> Service Accounts -> Generate new private key`

Save it as `packages/data-pipeline/service-account.json` (it is in `.gitignore`).

## Running the pipeline

```bash
python run_pipeline.py           # full pipeline: scrape, process, push
python run_pipeline.py --scrape  # scrape and process only (no Firestore push)
python run_pipeline.py --push    # push only (uses existing processed files)
```

Or run individual steps:

```bash
python scrapers/cso_scraper.py       # fetch housing and employment from CSO
python scrapers/weather_scraper.py   # fetch climate data from Met Eireann
python processors/clean_housing.py   # parse and convert RPPI index to prices
python processors/clean_employment.py  # compute unemployment rate from LFS counts
python ingest/push_to_firestore.py   # push processed JSON to Firestore
```

## Data sources

| Dataset                            | Source                      | Table                      |
| ---------------------------------- | --------------------------- | -------------------------- |
| Residential Property Price Index   | CSO Ireland (ws.cso.ie)     | HPM09                      |
| Labour Force Survey (unemployment) | CSO Ireland (ws.cso.ie)     | QLF06                      |
| Monthly climate normals            | Met Eireann (cli.fusio.net) | Dublin Airport station 532 |

All data is open and publicly licensed for reuse.

## How it works

**Housing:** Fetches HPM09 (monthly RPPI index, base Jan 2015 = 100) and converts to approximate euro prices using CSO-published 2015 median anchors (national: 190,000, Dublin: 275,000).

**Employment:** Fetches QLF06 (seasonally adjusted person counts in thousands) and computes the unemployment rate as: `Unemployed / In_labour_force * 100`.

**Weather:** Fetches Dublin Airport monthly records from Met Eireann and averages by calendar month. Falls back to published 1991-2020 climate normals if the server is unreachable.

## Automation

A GitHub Actions workflow runs the full pipeline every Monday at 06:00 UTC. It can also be triggered manually from the Actions tab. Requires the `FIREBASE_SERVICE_ACCOUNT_JSON` repository secret to be set.
