---
name: deployment
description: Infrastructure and deployment documentation
scope: all
---

# Deployment

## CI/CD Pipeline

- **Platform**: Vercel (auto-deploy on push to main)
- **Build command**: `prisma migrate deploy && prisma generate && next build`
- No explicit CI config file found (Vercel handles it)

## Monitoring & Logging

- **Logging**: Centralized action logging via `utils/logger.ts`
- No external monitoring tools configured

## Deployment Process

- Push to `main` → Vercel auto-deploys
- Database migrations: run manually via `npx prisma migrate deploy`

## Database Environment

- **Development**: Local PostgreSQL via `DATABASE_URL` in `.env`
- **Production**: Vercel Postgres via `DATABASE_URL` and `POSTGRES_URL_NON_POOLING`

### Migration Workflow

- Dev: `npx prisma migrate dev` — standard Prisma workflow
- Prod: `npx prisma migrate deploy` — Vercel handles on deploy
- Seed: `npx prisma db seed` — additive seed data only

# Infrastructure

## Project Structure

```plaintext
/ (Next.js project root)
├── app/          # App Router pages + API routes
├── components/   # React components
├── lib/          # Server actions + hooks
├── domain/       # Zod schemas + enums
├── utils/        # Shared utilities
├── prisma/       # Prisma schema
├── database/     # Init SQL
└── public/       # Static assets
```

## Environment Variables

### Environment Files

- `.env` (see `.env example` in project root)

### Required Environment Variables

| Variable | Purpose |
| -------- | ------- |
| `DATABASE_URL` | PostgreSQL connection pooling URL (Vercel Postgres) |
| `POSTGRES_URL_NON_POOLING` | PostgreSQL direct connection URL |
| `AUTH_GITHUB_ID` | GitHub OAuth app client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth app client secret |
| `AUTH_GOOGLE_ID` | Google OAuth app client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth app client secret |
| `CLOUDINARY_*` | Cloudinary credentials for image storage |

## URLs

- **Development**: http://localhost:3000
- **Production**: Vercel-hosted (URL not documented)
