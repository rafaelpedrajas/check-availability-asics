import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/setMyCommands`;

const commands = [
  { command: "add", description: "Añadir modelo y talla. Ej: /add nimbus 50.5" },
  { command: "remove", description: "Eliminar modelo y talla. Ej: /remove nimbus 50.5" },
  { command: "list", description: "Mostrar todos los modelos y tallas configuradas" },
  { command: "help", description: "Mostrar ayuda y comandos disponibles" }
];

fetch(API_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ commands })
})
  .then(res => res.json())
  .then(data => console.log("📬 Comandos registrados:", data))
  .catch(err => console.error("❌ Error al registrar comandos:", err));
