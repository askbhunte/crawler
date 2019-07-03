const axios = require("axios");
const config = require("config");
const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");
let botUrl = config.get("services.nepalbot.url");
module.exports = async () => {
  let url = `https://foodmandu.com/webapi/api/Product/getproducts?Keyword=&vendorid=${id}`;
  let scraper = new ScraperClient({
    name: "MNU",
    repo: {
      url: botUrl + "/food/menu/feed"
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
