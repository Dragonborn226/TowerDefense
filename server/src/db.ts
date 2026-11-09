import pg from "pg";

const pool = new pg.Pool({
  connectionString:
    process.env.DATABASE_URL ?? "postgres://towerdefense:towerdefense@localhost:5432/towerdefense",
  connectionTimeoutMillis: 2000,
});

// Without a listener, an idle client losing its connection crashes the process.
pool.on("error", (error) => console.error("Postgres connection error:", error.message));

export async function isDatabaseUp(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}
