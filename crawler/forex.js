const axios = require("axios");
const CrawlUtils = require("./utils");

let baseUrl = "https://nrb.org.np/exportForexJSON.php";

class Forex {
  async scrapeForex() {
    let { data } = await axios.get(baseUrl);
    return data.Conversion.Currency;
  }
  async process() {
    let forexData = await this.scrapeForex();
    let forexList = await CrawlUtils.uploadData({
      path: "/forex/feed",
      data: forexData
    });

    return forexList.length;
  }
}

module.exports = new Forex();
