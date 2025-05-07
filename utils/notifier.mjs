import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function notifyTelegramImage({ title, image, price, url }) {
  try {
    if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn("⚠️ Falta TELEGRAM_TOKEN o TELEGRAM_CHAT_ID");
      throw new Error("⚠️ Falta TELEGRAM_TOKEN o TELEGRAM_CHAT_ID");
    }

    const caption = `👟 *${title}*\n💰 *${price}*\n\n[🛒 Ver producto](${url})`;
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`;

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        photo: image,
        caption,
        parse_mode: "Markdown",
      }),
    });

    const data = await res.json();
    if (!data.ok) throw new Error(JSON.stringify(data));

  } catch (error) {
    console.error("❌ Fallo al enviar foto a Telegram:", error);
  }
}

export async function notifyTelegramMessage({ text }) {

  try {
    if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn("⚠️ Falta TELEGRAM_TOKEN o TELEGRAM_CHAT_ID");
      throw new Error("⚠️ Falta TELEGRAM_TOKEN o TELEGRAM_CHAT_ID");
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text,
                parse_mode: "Markdown",
            }),
        });

    const data = await res.json();
    if (!data.ok) throw new Error(JSON.stringify(data));

  } catch (error) {
    console.error("❌ Fallo al enviar mensaje a Telegram:", error);
  }
}