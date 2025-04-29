const fs = require("fs");
const { JSDOM } = require("jsdom");

// Lê o HTML salvo localmente
const html = fs.readFileSync("./amazon-page.html", "utf-8");

// Cria o DOM
const dom = new JSDOM(html);
const document = dom.window.document;

// Seleciona todos os títulos de produto
const titles = [...document.querySelectorAll("span.a-size-large product-title-word-break")]

// Mostra os títulos no console
titles.forEach((title, i) => {
  console.log(`${i + 1}. ${title.textContent.trim()}`);
});
