# EduCart

## Prerequisites

- Node.js 18+
- Docker Desktop

---

## Frontend

```bash
cd fe
npm install
npm run dev        # runs on http://localhost:3000
```

> After editing `fe/.env`, restart `npm run dev` — Next.js bakes env vars at start time.

---

## Backend

All Docker commands must be run from the **`be/`** directory (where `docker-compose.yml` lives).

```bash
cd be
```

### First run / after schema changes

Wipes the database volume and rebuilds everything from scratch.
Use this whenever `sql/educart_schema.sql` changes.

```bash
docker compose down -v && docker compose up --build
```

### After code-only changes (no schema change)

Rebuilds the API image without touching the database.

```bash
docker compose up --build
```

### Start without rebuilding

For when nothing has changed — just start existing containers.

```bash
docker compose up
```

### Stop and remove containers (keep database)

```bash
docker compose down
```

### Stop and remove containers **and database** (full reset)

```bash
docker compose down -v
```

---

## Environment variables

### `be/.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Backend API port | `5050` |
| `DB_PASSWORD` | SQL Server SA password | |
| `JWT_SECRET` | JWT signing secret | |

### `fe/.env`

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Backend base URL (no `/api` suffix) | `http://localhost:5050` |

> **Port consistency**: `PORT` in `be/.env` must match the port in `NEXT_PUBLIC_API_BASE_URL` in `fe/.env`.

---

## How the database initialises

`init-db.sh` runs inside the `db-init` container on every `docker compose up`:

- **If the `EduCart` database does not exist** → creates schema, runs stored procedures, triggers, and seeds data.
- **If the `EduCart` database already exists** → skips schema creation, re-runs stored procedures, triggers, and seeds (all idempotent).

**Consequence:** schema changes (new tables/columns) are only applied on a fresh database.  
To apply schema changes to an existing setup, run `docker compose down -v && docker compose up --build`.
