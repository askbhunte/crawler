const axios = require("axios");
const config = require("config");

const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");

let date = new Date();
let year = date.getFullYear();
let month = (date.getMonth() < 10 ? "0" : "") + (date.getMonth() + 1);
let day = (date.getDate() < 10 ? "0" : "") + date.getDate();
//let url = `https://nrb.org.np/exportForexJSON.php?YY=${year}&MM=${month}&DD=${day}&YY1=${year}&MM1=${month}&DD1=${day}`;
let url = `https://nrb.org.np/exportForexJSON.php`;
let botUrl = config.get("services.nepalbot.url");
module.exports = async () => {
  let scraper = new ScraperClient({
    name: "BUL",
    repo: {
      url: botUrl + "/forex/feed"
    }
  });
  return scraper.process({
    target: { url },
    isJson: true,
    extractor: d => {
      return d;
    }
  });
};
