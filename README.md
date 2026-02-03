# Kurzzeitplaylists Client

The client is a React app for managing Spotify playlist cleanup rules.

## Requirements

- Node.js (LTS recommended)
- The server running locally or on a reachable host

## Quick Start

```bash
cd Client
yarn install
yarn start
```

The app runs on `http://127.0.0.1:3000` by default.

## Environment Variables

Create `Client/.env` (copy from `Client/.env.example`) and set:

- `REACT_APP_SERVER_ORIGIN`: Server origin used for auth links (e.g. `http://127.0.0.1:8888`).
- `REACT_APP_API_BASE_URL`: API origin for JSON requests (defaults to `REACT_APP_SERVER_ORIGIN`).
- `REACT_APP_ROUTER_BASENAME`: Optional base path when hosting under a sub-path.

## Scripts

- `yarn start`: Run the development server.
- `yarn test`: Run tests.
- `yarn build`: Build the production bundle.

## Notes

- Make sure the server `CLIENT_APP_URL` matches the client origin.
- If you change `.env`, restart the dev server.
