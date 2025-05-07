import { getProductsFromURL } from "./utils/scraper.mjs";
import { notifyTelegramImage, notifyTelegramMessage } from "./utils/notifier.mjs";
import { connectDB, wasAlreadyNotified, markNotified, getWatchlist } from "./utils/db.mjs";
import dotenv from "dotenv";

dotenv.config();

try {
  await connectDB();

  const watchlist = await getWatchlist();

  if (watchlist.length === 0) {
    console.log("📭 No hay modelos configurados. Usa /add para empezar.");
    process.exit(0);
  }

  for (const entry of watchlist) {
    const { model, size, notify_id } = entry;

    const url = `https://outlet.asics.com/es/es-es/mens-shoes/c/ao10200000/?prefn1=sizeEU&prefv1=${size}&start=0&sz=100`;
    console.log(`🔍 Buscando '${model}' en talla ${size}...`);

    const products = await getProductsFromURL(url);
    const found = products.find(p =>
      p.title.toLowerCase().includes(model.toLowerCase())
    );

    if (!found) {
      console.log(`❌ No encontrado: ${model} ${size}`);
      continue;
    }

    const alreadySent = await wasAlreadyNotified(notify_id);
    if (alreadySent) {
      console.log(`✅ Ya se notificó hoy: ${notify_id}`);
      continue;
    }

    await notifyTelegramImage(found);
    await markNotified(notify_id);
    console.log(`🚀 Notificado por Telegram: ${model} ${size}`);
  }

} catch (error) {
  console.error("❌ Error crítico en el bot:", error);
  await notifyTelegramMessage({
    text: `❌ Error en el bot:\n\`${error.message}\``,
    parse_mode: "Markdown"
  });
}
