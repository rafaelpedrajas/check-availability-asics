import fetch from "node-fetch";
import dotenv from "dotenv";
import { handleTelegramCommand } from "./utils/commands.mjs";

dotenv.config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

let offset = 0;

async function pollTelegram() {
  try {
    const res = await fetch(`${API_URL}/getUpdates?offset=${offset + 1}`);
    const data = await res.json();

    if (!data.ok) {
      console.error("❌ Error obteniendo mensajes de Telegram:", data);
      return;
    }

    for (const update of data.result) {
      offset = update.update_id;
      const message = update.message;
      if (message && message.text.startsWith("/")) {
        console.log("📥 Comando recibido:", message.text);
        await handleTelegramCommand(message);
      }
    }
  } catch (err) {
    console.error("❌ Error en polling de Telegram:", err);
  }
}

setInterval(pollTelegram, 3000); // revisa cada 3 segundos
console.log("🤖 Bot de comandos de Telegram escuchando...");