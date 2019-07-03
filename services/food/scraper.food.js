const axios = require("axios");
const config = require("config");
const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");
let url = "https://foodmandu.com/webapi/api/Vendor/GetVendors1?PageSize=1000";
let botUrl = config.get("services.nepalbot.url");
module.exports = async () => {
  let scraper = new ScraperClient({
    name: "FOD",
    repo: {
      url: botUrl + "/food/feed"
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
