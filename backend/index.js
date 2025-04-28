import express from 'express'
import axios from 'axios'
import { JSDOM } from 'jsdom'

const app = express()

app.get("/", (req, res) => {
  res.send("Server is running!")
})

app.listen(3000, () => {
  console.log("Server running in http://localhost:3000")
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
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Wind64; x64", //'User-Agent' make sure we are not confused with bots
            }
        })

        const html = response.data

        const dom = new JSDOM(html)
        const document = dom.window.document

        const products = document.querySelectorAll('.s-result-item')
        const results = []

        products.forEach((product) => {
            const titleElement = product.querySelector('h2 a span')
            const title = titleElement ? titleElement.textContent : null

            const starsElement = product.querySelector('.a-icon-alt')
            const stars = starsElement ? starsElement.textContent : null

            const reviewsElement = product.querySelector('.a-size-base')
            const reviews = reviewsElement ? reviewsElement.textContent : null

            const imageElement = product.querySelector('img.s-image')
            const image = imageElement ? imageElement.src : null

            if (title) {
                results.push({
                    title,
                    stars,
                    reviews,
                    image
                })
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