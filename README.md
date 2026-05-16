# Simple Web API

Express 5 + Prisma + Paseto + Supabase PostgreSQL. Modular backend with auto route loading, authentication, Zod validation, and structured logging.

## Stack

- **Express 5** — async HTTP framework
- **Prisma 7** + **Supabase PostgreSQL** — connection pooling via `@prisma/adapter-pg`
- **Paseto v4** — stateless access & refresh tokens
- **Zod** — request validation
- **Helmet** — security headers
- **Winston** — structured logging
- **Husky** — pre-commit lint + typecheck

## Architecture

```
src/
  index.ts              → database connect + graceful shutdown
  app.ts                → express setup (helmet, cors, middleware)
  routes.ts             → auto-load *.route.ts from routes/

  config/               → env config (server, db, cors, tokens)
  database/client.ts    → PrismaClient + Supabase adapter
  types/                → shared types + express.d.ts
  logger/               → winston (dev console / prod file)

  lib/                  → global helpers
    errors.ts           → AppError class
    response.ts         → successResponse, errorResponse
    token.ts            → Paseto sign / verify
    password.ts         → argon2 hash / compare
    async-handler.ts    → async error wrapper

  middlewares/
    auth.ts             → authenticate (Bearer → verify token)
    validate.ts         → Zod schema validator
    body-validation.ts  → reject empty body
    error-handler.ts    → global error handler
    not-found.ts        → 404 handler

  repository/           → data access layer
    user.repository.ts  → findById, findByEmail, findByUsername, create

  modules/              → feature modules (controller + service + validation + types)
    auth/
      auth.controller.ts
      auth.service.ts
      auth.validation.ts
      auth.errors.ts
      auth.type.ts

  routes/               → route wiring (validator → controller)
    auth.route.ts       → POST /api/auth/register, POST /api/auth/login
    health.route.ts     → GET /api/health
```

## Module Pattern

```
modules/{feature}/
  *.controller.ts   → HTTP handlers (req → service → res)
  *.service.ts      → business logic (panggil repository)
  *.validation.ts   → Zod schemas
  *.errors.ts       → error helpers
  *.type.ts         → payload & response interfaces
  index.ts          → barrel exports
```

Routes wire them together:

```typescript
router.post('/register', validate(validation.register), controller.register)
```

## Auth

| Endpoint             | Method | Auth   | Description                             |
| -------------------- | ------ | ------ | --------------------------------------- |
| `/api/auth/register` | POST   | —      | Register with username, email, password |
| `/api/auth/login`    | POST   | —      | Login, returns access + refresh tokens  |
| `/api/auth/me`       | GET    | Bearer | Current user profile                    |

## Quick Start

```bash
npm install
cp .env.example .env.development

# Generate Paseto key pair
npm run generate:key

# Paste keys into .env.development + configure Supabase credentials

# Run migrations
npx prisma migrate dev

# Start dev server
npm run dev
```

## Scripts

| Command                  | Description                |
| ------------------------ | -------------------------- |
| `npm run dev`            | Dev server with hot reload |
| `npm run build`          | Build to `dist/`           |
| `npm start`              | Production build           |
| `npm run typecheck`      | TypeScript check           |
| `npm run lint`           | ESLint                     |
| `npm run format`         | Prettier format            |
| `npm run generate:key`   | Paseto key pair            |
| `npx prisma migrate dev` | Run Prisma migrations      |

## Environment

`.env.development` is gitignored. Required vars:

```
# Supabase
DATABASE_URL=           # connection pooling (supabase pooler)
DIRECT_URL=             # direct connection (for migrations)

# Paseto (from npm run generate:key)
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_PUBLIC=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_PUBLIC=

# CORS
CORS_ORIGIN=            # comma-separated or *
CORS_METHODS=           # comma-separated methods
```

## DB Schema

```prisma
model User {
  id         String   @id @default(uuid())
  username   String   @unique
  email      String   @unique
  password   String
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
}
```
