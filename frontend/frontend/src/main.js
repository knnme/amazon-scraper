const app = document.getElementById("app")

// app.innerHTML = `
//   <h1>Amzon Scraper</h1>
//   <input type="text" id="keyboard" placeholder="Search product..." />
//   <button id="searchBtn">Search</button>
//   <div id="results"></div>
// `

const input = document.getElementById("keyboard")
const button = document.getElementById("searchBtn")
const resultDiv = document.getElementById("results")

button.addEventListener("click", async () => {
  const keyword = input.value.trim()

  if (!keyword) {
    alert("Please enter a product.")
    return
  }

  try {
    const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`)
    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.log("Error to find datas", error)
  }
})