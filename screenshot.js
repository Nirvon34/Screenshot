const { chromium } = require('playwright');

// берем аргумент из командной строки
const input = process.argv[2];

if (!input) {
    console.log("Укажи regNumber или ссылку:");
    console.log("node screenshot.js 32616013925");
    console.log("или");
    console.log("node screenshot.js 'https://...' ");
    process.exit(1);
}

// если это число — строим ссылку
let url;
let fileName;

if (input.startsWith("http")) {
    url = input;

// пытаемся вытащить regNumber из ссылки
    const match = input.match(/regNumber=(\d+)/);
    fileName = match ? match[1] : "tender";
} else {
    url = `https://zakupki.gov.ru/epz/order/notice/notice223/common-info.html?regNumber=${input}`;
    fileName = input;
}

(async () => {
    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle' });

    await page.waitForTimeout(5000);

    const path = `tender_${fileName}.png`;

    await page.screenshot({
        path,
        fullPage: true
    });

    console.log("Скриншот сохранён:", path);

    await browser.close();
})();