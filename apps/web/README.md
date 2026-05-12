# Léargas: Web App

Next.js 16 frontend for the Léargas Irish data analytics dashboard.

## Development

```bash
# From the repo root
npm install
npm run dev
# -> http://localhost:3000
```

## Environment variables

Copy `.env.example` to `apps/web/.env.local` and fill in your Firebase config:

```bash
cp .env.example apps/web/.env.local
```

Get the values from Firebase Console -> Project Settings -> Your apps -> Web app.

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # TypeScript check
npm run test       # Vitest unit tests
```

See the [root README](../../README.md) for full project documentation.
