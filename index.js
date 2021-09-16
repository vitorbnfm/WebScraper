const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');
const fs = require('fs');
var Excel = require("exceljs");

console.log('Web Scraping Google Ads');


async function scraper() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const search = readlineSync.question('Informe pesquisa no formato "exemplo+exemplo": ') || 'rci+boleto';
  
    const url = `https://www.google.com/search?q=${search}&aqs=chrome.0.69i59.1396j0j4&sourceid=chrome&ie=UTF-8`;

  await page.goto(url);
  
  const results = await page.evaluate(() => {
    const searchResults = document.querySelectorAll('.cUezCb.luh4tb.O9g5cc.uUPGi');
    const links = [];
    var date = new Date().toLocaleString();
    searchResults.forEach((searchItem) => { 
      let item = {
        link: searchItem.querySelector("a").href,
        anuncio: searchItem.querySelector("a").getAttribute('data-rw'),
        data: date,
      };
      links.push(item);
    });
    return links;
  });

  //working
  const filename = './scraperResult.xlsx';
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(filename);

  const  worksheet = workbook.getWorksheet("resultado");
  let row = worksheet.getRow(1);
  
  row.getCell(1).value = results[0].link;

  workbook.xlsx.writeFile(filename);

 
  fs.writeFile('./ads.json', JSON.stringify(results, null, 2), err => err ? console.log(err): null);
  
  
  //console.log(JSON.stringify(results))
  await browser.close();
}

scraper();
