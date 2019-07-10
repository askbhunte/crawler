const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");

let botUrl = config.get("services.nepalbot.url");
let baseUrl = "https://thehimalayantimes.com/category/lifestyle/horoscopes/";
const CrawlUtils = require("./utils");

let horoscopes = [
  "libra",
  "aries",
  "leo",
  "virgo",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
  "gemini",
  "cancer",
  "taurus"
];

class Horoscope {
  constructor() {}

  async scrapHoroscope() {
    let list = [];
    for (var horoscope of horoscopes) {
      let { data } = await axios.get(baseUrl + horoscope);
      const $ = cheerio.load(data);
      data = {
        horoscope,
        summary: $(".row")
          .find(".col-sm-9")
          .find("p:first-child")
          .text()
      };
      list.push(data);
    }
    return list;
  }

  async process() {
    let horoscopeList = await this.scrapHoroscope();
    await CrawlUtils.uploadData({
      path: "/horoscope",
      data: horoscopeList
    });

    return horoscopeList.length;
  }
}

module.exports = new Horoscope();
