// const axios = require("axios");
// const cheerio = require("cheerio");

// async function abc() {
//   let response = await axios(
//     "https://nrb.org.np/exportForexJSON.php?YY=2019&MM=03&DD=16&YY1=2019&MM1=03&DD1=16"
//   );
//   // const html = response.data;
//   // const $ = cheerio.load(html);
//   // let data = extractor($);
//   console.log(response.data.Conversion.Currency);
// }
// abc();

const scrape = require("./scraper.forex");
console.log(scrape);
