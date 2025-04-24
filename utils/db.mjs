import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db;

export async function connectDB() {
  db = await open({
    filename: "./db/state.sqlite",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      date TEXT
    )
  `);
}

export async function wasAlreadyNotified(id) {
  const today = new Date().toISOString().slice(0, 10);
  const result = await db.get(
    "SELECT * FROM notifications WHERE id = ? AND date = ?",
    [id, today]
  );
  return !!result;
}

export async function markNotified(id) {
  const today = new Date().toISOString().slice(0, 10);
  await db.run(
    "INSERT OR REPLACE INTO notifications (id, date) VALUES (?, ?)",
    [id, today]
  );
}
