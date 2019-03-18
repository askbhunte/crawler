const axios = require("axios");
const config = require("config");

const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");

let date = new Date();
let year = date.getFullYear();
let month = (date.getMonth() < 10 ? "0" : "") + (date.getMonth() + 1);
let day = (date.getDate() < 10 ? "0" : "") + date.getDate();
let url = `https://nrb.org.np/exportdsdForexJSON.php?YY=${year}&MM=${month}&DD=${day}&YY1=${year}&MM1=${month}&DD1=${day}`;
let botUrl = config.get("services.nepalbot.url");

module.exports = async () => {
  let scraper = new ScraperClient({
    name: "BUL",
    repo: {
      url: botUrl + "/forex/feed"
    }
  });
  try {
    let response = await axios.get(url);
    let data = response.data.Conversion.Currency;
    console.log(data);
    await scraper.saveToBotApi(data);
    return data;
  } catch (error) {
    return scraper.handleError(error);
  }
};

// let forex = res.data.Conversion.Currency;
// forex = forex.map(d => {
//   return {
//     date: d.Date,
//     base_currency: d.BaseCurrency,
//     target_currency: d.TargetCurrency,
//     base_value: d.BaseValue,
//     buy: d.TargetBuy,
//     sell: d.TargetSell
//   };
// });
