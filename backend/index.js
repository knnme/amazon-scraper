import express from 'express'
import axios from 'axios'
import { JSDOM } from 'jsdom'
import cors from 'cors'

const app = express()

app.use(cors())

app.get("/", (req, res) => {
  res.send("Server is running!")
})

app.get("/api/scrape", async (req, res) => {
    // get what user serach with 'keyword'
    const keyword = req.query.keyword;

    if (!keyword) {
        return res.status(400).json({ error: "Keyword missing" })
    }

    try {
        // Amazon page request
        const response = await axios.get(`https://www.amazon.com/s?k=${keyword}`, {
            headers: {
                "User-Agent": 
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36" 
                        //'User-Agent' make sure we are not confused with bots
            }
        })

        const html = response.data
        const dom = new JSDOM(html)

        const document = dom.window.document

        const products = document.querySelectorAll("div.s-result-item[data-component-type='s-search-result']");
        const results = [];

        products.forEach((product) => {
            const title = product.querySelector("h2 span")?.textContent?.trim() || null;
            const stars = product.querySelector("span.a-icon-alt")?.textContent?.trim() || null;
            const reviews = product.querySelector("span.a-size-base")?.textContent?.trim() || null;
            const image = product.querySelector("img.s-image")?.src || null;

            if (title) {
                results.push({ title, stars, reviews, image });
            }
        });
        res.json(results)
        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Error to find informations."})
    }

})

app.listen(3000, () => {
    console.log("Server is running at https://localhost:3000")
})