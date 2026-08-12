const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.goto("https://www.kurly.com/collection-groups/market-newproduct?page=1&collection=newranking1", {
    waitUntil: "domcontentloaded",
    timeout: 60000
  });

  await page.waitForSelector('a[href^="/goods/"]');

  const items = await page.$$eval('a[href^="/goods/"]', (cards) =>
    cards.map((card) => {
      const title = card.querySelector('div[style*="word-break"]')?.textContent?.trim() || "";

      // 이미지 처리
      const imgTag = card.querySelector("img");
      let image = imgTag?.getAttribute("src") || imgTag?.getAttribute("data-src") || "";
      if (image && !image.startsWith("http")) image = "https:" + image;

      // 링크
      const link = card.href;

      // 가격 계산
      const priceTexts = Array.from(card.querySelectorAll("span"))
        .map((el) => el.textContent?.replace(/[^0-9]/g, ""))
        .filter((t) => t?.length > 2);

      const [p1, p2] = priceTexts.map(Number);
      const 원가 = Math.max(p1, p2);
      const 할인가 = Math.min(p1, p2);
      const 할인율 = (원가 && 할인가) ? Math.round((1 - 할인가 / 원가) * 100) : 0;

      return { title, image, link, 원가, 할인가, 할인율 };
    })
  );

  // 필터링: 20% 이상만
  const filtered = items.filter((item) => item.할인율 >= 20 && item.할인율 < 100 && item.할인가 < item.원가);

  // 저장
  fs.writeFileSync("kurly-discount.json", JSON.stringify(filtered, null, 2), "utf-8");

  console.log(`✅ 마켓컬리 할인율 20% 이상 상품 ${filtered.length}개 저장 완료`);

  await browser.close();
})();
