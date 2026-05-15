# EduCart Frontend

EduCart frontend is built with Next.js App Router, Tailwind CSS, Framer Motion, and Lucide React.

## Prerequisites

- Node.js 18+ (recommended Node.js 20)
- npm 9+

## Environment setup

1. Create a local env file (if it does not exist yet):

   cp .env.example .env

2. Update these values as needed:

   PORT=3000
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
   NEXT_PUBLIC_API_BASE_URL_PROD=

`NEXT_PUBLIC_API_BASE_URL_PROD` is optional. If it is empty, the dev value is used.

## Run frontend

1. Install dependencies:

   npm install

2. Start development server:

   npm run dev

3. Open browser:

   http://localhost:3000

## Available pages

- Landing page: /
- Home feed: /home

## Build for production

1. Build app:

   npm run build

2. Run production server:

   npm run start

## Troubleshooting

- If port 3000 is busy, run:

  npm run dev -- -p 3001

- If modules are missing, reinstall:

  npm install

## Run backend + frontend together

1. Backend (Docker):

   cd ../be
   docker compose up --build

2. Frontend:

   cd ../fe
   npm run dev

3. Access services:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api/health

## Port conflicts

If a port is blocked (for example 5000), update PORT in be/.env and update
NEXT_PUBLIC_API_BASE_URL in fe/.env to match the new backend port.
