// utils/stealth.mjs
import { chromium } from "playwright";

export async function createStealthContext({ headless = true } = {}) {
  const browser = await chromium.launch({ headless });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  await page.addInitScript(() => {
    // Oculta propiedades comunes detectables
    Object.defineProperty(navigator, "webdriver", {
      get: () => false,
    });

    Object.defineProperty(navigator, "languages", {
      get: () => ["es-ES", "es"],
    });

    Object.defineProperty(navigator, "plugins", {
      get: () => [1, 2, 3],
    });

    window.chrome = {
      runtime: {},
    };

    // Elimina nombres sospechosos del objeto window
    for (const prop in window) {
      if (/^(cdc_|__webdriver_evaluation_script|__driver_evaluation_script)/.test(prop)) {
        delete window[prop];
      }
    }
  });

  return { browser, page };
}
