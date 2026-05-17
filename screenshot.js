import express from "express";
import puppeteer from "puppeteer";

const app = express();
app.use(express.json({ limit: "10mb" }));

app.post("/screenshot", async (req, res) => {
    try {
        const url = req.body.url;

        if (!url) {
            return res.status(400).send("No URL");
        }

        const browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

        const buffer = await page.screenshot({ fullPage: true });

        await browser.close();

        res.set("Content-Type", "image/png");
        res.send(buffer);

    } catch (e) {
        res.status(500).send("Error: " + e.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
