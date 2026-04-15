# EduCart Frontend

EduCart frontend is built with Next.js App Router, Tailwind CSS, Framer Motion, and Lucide React.

## Prerequisites

- Node.js 18+ (recommended Node.js 20)
- npm 9+

## Run locally

1. Open terminal at this folder c:\Users\user\Desktop\EduCart\frontend :
   cd frontend

2. Install dependencies:

   npm install

2'. Install Framer Motion

   npm install framer-motion lucide-react

2.2. 

   npm install @radix-ui/react-accordion lucide-react clsx tailwind-merge

3. Start development server:

   npm run dev

4. Open browser:

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

1. Open terminal at workspace root:

   c:\Users\user\Desktop\EduCart

2. Install root helper dependency:

   npm install

3. Install backend dependencies:

   npm --prefix backend install

4. Start both services in one command:

   npm run dev

5. Access services:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
