import { getProductsFromURL } from "./utils/scraper.mjs";
import { notifyTelegramImage, notifyTelegramMessage } from "./utils/notifier.mjs";
import { connectDB, wasAlreadyNotified, markNotified } from "./utils/db.mjs";
import dotenv from "dotenv";

dotenv.config();

const URL = "https://outlet.asics.com/es/es-es/mens-shoes/c/ao10200000/?prefn1=sizeEU&prefv1=50.5";
const KEYWORD = "nimbus";
const NOTIFY_ID = "asics-nimbus-50.5";

try {
  await connectDB();

  const products = await getProductsFromURL(URL);
  const found = products.find((p) => p.title.toLowerCase().includes(KEYWORD));

  if (!found) {
    console.log("❌ No se encontró 'nimbus' en talla 50.5");
    process.exit(0);
  }

  const alreadySent = await wasAlreadyNotified(NOTIFY_ID);
  if (alreadySent) {
    console.log("✅ Ya se notificó hoy.");
    process.exit(0);
  }

  await notifyTelegramImage(found);
  await markNotified(NOTIFY_ID);
  console.log("🚀 Notificación enviada a Telegram.");

} catch (error) {
  console.error('❌ Error crítico en el bot:', error);
  await notifyTelegramMessage({
    text: `❌ Error en el bot:\n\`${error.message}\``
  });
}



