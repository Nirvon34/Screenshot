import express from "express";
import puppeteer from "puppeteer";

const app = express();
app.use(express.json());

app.post("/screenshot", async (req, res) => {
    try {
        const url = req.body.url;

        if (!url) return res.status(400).send("No URL");

        const browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage"
            ]
        });

        const page = await browser.newPage();

        await page.setViewport({ width: 1280, height: 720 });

        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 0
        });

        const buffer = await page.screenshot({ fullPage: true });

        await browser.close();

        res.setHeader("Content-Type", "image/png");
        res.end(buffer);

    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
});
