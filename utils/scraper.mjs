import { createStealthContext } from "./stealth.mjs";

export async function getProductsFromURL(url) {
  const { browser, page } = await createStealthContext({ headless: true });

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    await page.waitForFunction(() => {
      return document.querySelectorAll(".grid-tile").length > 0;
    }, { timeout: 15000 });

    const products = await page.$$eval(".grid-tile", (tiles) =>
      tiles.map((el) => {
        const title = el.querySelector(".product-name")?.textContent.trim();
        const firstSlide = el.querySelector(".image-carousel-slide");
        const imgEl = firstSlide?.querySelector("img");
        const image = imgEl?.getAttribute("data-lazy") || imgEl?.getAttribute("src");
        const price = el.querySelector(".price-sales-discount")?.textContent.trim();
        const url = el.querySelector(".product-tile__link")?.href;
        return { title, image, price, url };
      })
    );

    return products;
  } catch (err) {
    console.error("❌ Error scraping productos:", err);
    return [];
  } finally {
    await browser.close();
  }
}
