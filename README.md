# TowerDefense

Web-based tower defense game. Babylon.js client, Node.js + TypeScript server, PostgreSQL storage.

## Run it

Requires Node 22+.

```sh
npm install
npm run dev
```

Open http://localhost:5173.

## Database (optional for now)

With Docker running:

```sh
npm run db:up
```

http://localhost:3001/api/health reports whether the server can reach Postgres. Set `DATABASE_URL` to use a different database.

## Production

```sh
npm run build
npm start
```

The server hosts the game at http://localhost:3001.
