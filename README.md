# Deceit

Deceit is a multiplayer social deduction game. Players receive secret roles, share clues, discuss, and vote to find the imposter. The web app also includes a local pass-and-play mode.

## Project Structure

```text
apps/
	api/          Fastify and Socket.IO server
	web/          Next.js web application
packages/
	config/       Shared application configuration
	game-engine/  Game rules and state transitions
	game-types/   Shared TypeScript types and schemas
prisma/         Prisma schema
```

The repository uses npm workspaces. Run workspace commands from the repository root unless a deployment provider requires a different project root.

## Requirements

- Node.js 20 or later
- npm

## Local Development

Install dependencies from the repository root:

```sh
npm ci
```

Start the API, web app, and package watchers:

```sh
npm run dev
```

The web app runs at `http://localhost:3000` and the API listens on port `4000` by default. To use online multiplayer locally, create `apps/web/.env.local` with:

```dotenv
NEXT_PUBLIC_WS_URL=http://localhost:4000
```

Without this variable, online multiplayer remains disabled; local pass-and-play is still available.

## Build and Test

Build all workspaces from the repository root:

```sh
npm run build
```

Run the game-engine tests after building:

```sh
npm test --workspace=@deceit/game-engine
```

## Deploy the API to Render

Create a Render Web Service connected to this repository. Use the repository root as the service root because the API depends on the shared workspaces.

| Setting | Value |
| --- | --- |
| Language | Node |
| Branch | `main` |
| Root Directory | Leave blank |
| Build Command | See below |
| Start Command | `npm run start --workspace=@deceit/api` |

Build Command:

```sh
npm ci --include=dev && npm run build --workspace=@deceit/config && npm run build --workspace=@deceit/game-types && npm run build --workspace=@deceit/game-engine && npm run build --workspace=@deceit/api
```

Set these environment variables in Render:

```text
NODE_ENV=production
NODE_VERSION=20
```

Do not set `PORT`; Render provides it. The API listens on `0.0.0.0` and uses the provided port. Set Render's health check path to `/health`. A healthy response includes `"status":"healthy"`.

## Deploy the Web App to Vercel

Create a Vercel project for this repository using the Next.js framework. Set the Root Directory to `apps/web` and enable including files outside the Root Directory so the root lockfile and shared workspace packages are available to the build.

Use these commands, which assume Vercel runs them from `apps/web`:

Install Command:

```sh
npm ci --include=dev --prefix ../..
```

Build Command:

```sh
npm run build --prefix ../.. --workspace=@deceit/config && npm run build --prefix ../.. --workspace=@deceit/game-types && npm run build --prefix ../.. --workspace=@deceit/game-engine && npm run build --prefix ../.. --workspace=@deceit/web
```

Leave the Next.js output directory at its default.

After the API is deployed, add the following Vercel environment variable for Production:

```text
NEXT_PUBLIC_WS_URL=https://YOUR-RENDER-SERVICE.onrender.com
```

Use the Render service's HTTPS base URL. Do not include `/health`, `localhost`, or a `ws://` or `wss://` prefix. Set the variable as public configuration, not as a secret: `NEXT_PUBLIC_` values are included in browser code. Create a new Vercel production deployment after changing this variable.

## Runtime Notes

- The API exposes `GET /health` and attaches Socket.IO to the same HTTP server.
- Room and player state is stored in API process memory. A server restart clears active rooms, and multiple API instances do not share room state.
- Render free services may stop while idle, which can delay the first request after inactivity.
