# Step English Coach

Step English Coach is a local-first learning MVP for Grade 4, Grade 3, and Pre-2 English exam preparation.

## Features

- Daily study dashboard
- Vocabulary cards, games, and tests
- Grammar lessons with mini quizzes
- Practice questions and mistake review
- Mock exams with answer review
- Writing practice with local rule-based feedback
- Parent report and printable weekly packs

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Database

The app currently uses local JSON data for the learning experience. Prisma + SQLite are configured for future persistence.

```bash
npx prisma generate
npx prisma db push
npm run db:init
```

## Vercel

Recommended settings:

- Framework Preset: Next.js
- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: leave default

If Prisma is enabled on Vercel, set:

```text
DATABASE_URL=file:./dev.db
```

For the current static/localStorage MVP, no external API key is required.
