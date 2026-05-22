# Léargas

Irish public data dashboard built with Next.js, Firebase and Python.

## What it does

- Housing prices from CSO RPPI
- Employment data from CSO Labour Force Survey
- Weather from Met Eireann
- Users can save filter presets to Firestore

## Stack

- Next.js 14 / TypeScript
- Tailwind CSS v4
- Firebase Auth + Firestore
- Python data pipeline (httpx + firebase-admin)
- Deployed on Vercel

## Local setup

```bash
npm install
cp .env.example apps/web/.env.local
# fill in firebase keys
npm run dev
```

## Python pipeline

```bash
cd packages/data-pipeline
pip install -r requirements.txt
python run_pipeline.py
```

See packages/data-pipeline/README.md for more.
