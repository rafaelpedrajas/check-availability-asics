import { addWatch, removeWatch, getWatchlist, connectDB } from "./db.mjs";
import { notifyTelegramMessage } from "./notifier.mjs";
import dotenv from "dotenv";

dotenv.config();

const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Elimina "@BotName" de comandos con autocompletado
function normalizeCommand(command) {
  return command.split("@")[0].toLowerCase();
}

export async function handleTelegramCommand(message) {
  const chatId = message.chat.id;
  const text = message.text.trim();
  const parts = text.split(" ");
  const command = normalizeCommand(parts[0]);

  // ❌ Ignorar si el mensaje no viene del grupo autorizado
  if (chatId.toString() !== TELEGRAM_CHAT_ID) {
    console.warn(`🚫 Mensaje rechazado de chat ID no autorizado: ${chatId}`);
    return;
  }

  await connectDB();

  if (command === "/add") {
    const [_, model, size] = parts;
    if (!model || !size) {
      return notifyTelegramMessage({
        chat_id: chatId,
        text: "❗ Uso correcto: /add <modelo> <talla>",
      });
    }

    await addWatch(model, size);
    return notifyTelegramMessage({
      chat_id: chatId,
      text: `✅ Añadido: ${model} talla ${size}`,
    });

  } else if (command === "/remove") {
    const [_, model, size] = parts;
    if (!model || !size) {
      return notifyTelegramMessage({
        chat_id: chatId,
        text: "❗ Uso correcto: /remove <modelo> <talla>",
      });
    }

    await removeWatch(model, size);
    return notifyTelegramMessage({
      chat_id: chatId,
      text: `🗑 Eliminado: ${model} talla ${size}`,
    });

  } else if (command === "/list") {
    const watchlist = await getWatchlist();
    if (watchlist.length === 0) {
      return notifyTelegramMessage({
        chat_id: chatId,
        text: "📭 No hay modelos configurados aún.",
      });
    }

    const formatted = watchlist.map(w => `- ${w.model} talla ${w.size}`).join("\n");
    return notifyTelegramMessage({
      chat_id: chatId,
      text: `📋 Modelos rastreados:\n${formatted}`,
    });

  } else if (command === "/help") {
    return notifyTelegramMessage({
      chat_id: chatId,
      text: `🆘 *Comandos disponibles:*

              /add <modelo> <talla> – Añade un nuevo modelo a rastrear.  
              Ejemplo: /add nimbus 50.5

              /remove <modelo> <talla> – Elimina una combinación registrada.  
              Ejemplo: /remove sonoma 49

              /list – Muestra todas las combinaciones activas.  

              /help – Muestra esta ayuda.  

              Todos los comandos también funcionan con autocompletado como /add@TuBot.`,
      parse_mode: "Markdown"
    });
  } else {
    return notifyTelegramMessage({
      chat_id: chatId,
      text: "🤖 Comando no reconocido. Usa /help para ver opciones disponibles.",
    });
  }
}
