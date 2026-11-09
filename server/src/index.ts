import path from "node:path";
import express from "express";
import { isDatabaseUp } from "./db.js";

const PORT = Number(process.env.PORT ?? 3001);
const repoRoot = path.resolve(import.meta.dirname, "../..");

const app = express();

app.get("/api/health", async (_req, res) => {
  res.json({ ok: true, database: (await isDatabaseUp()) ? "up" : "down" });
});

app.use("/assets", express.static(path.join(repoRoot, "assets")));
app.use(express.static(path.join(repoRoot, "client/dist")));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
