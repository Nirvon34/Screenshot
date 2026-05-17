import express from "express";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const app = express();
app.use(express.json());

app.post("/screenshot", async (req, res) => {
    try {
        const url = req.body.url;
        if (!url) return res.status(400).send("No URL");

        const browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();

        await page.setViewport({ width: 1280, height: 720 });

        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 0
        });

        const buffer = await page.screenshot({ fullPage: true });

        await browser.close();

        res.setHeader("Content-Type", "image/png");
        res.end(buffer);

    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
});
