import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db;

export async function connectDB() {
  db = await open({
    filename: "./db/state.sqlite",
    driver: sqlite3.Database,
  });

  // Crear tabla de notificaciones
  await db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      date TEXT
    )
  `);

  // Crear tabla de modelos y tallas a rastrear
  await db.exec(`
    CREATE TABLE IF NOT EXISTS watchlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model TEXT NOT NULL,
      size TEXT NOT NULL,
      notify_id TEXT UNIQUE
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

export async function addWatch(model, size) {
  const notify_id = `${model}-${size}`;
  await db.run(
    "INSERT OR IGNORE INTO watchlist (model, size, notify_id) VALUES (?, ?, ?)",
    [model.toLowerCase(), size, notify_id]
  );
}

export async function removeWatch(model, size) {
  const notify_id = `${model}-${size}`;
  await db.run("DELETE FROM watchlist WHERE notify_id = ?", [notify_id]);
}

export async function getWatchlist() {
  return await db.all("SELECT model, size, notify_id FROM watchlist");
}