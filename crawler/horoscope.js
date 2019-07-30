const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");

let baseUrl = "https://thehimalayantimes.com/category/lifestyle/horoscopes/";
const utils = require("./utils");

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
    let collection = {};
    for (var horoscope of horoscopes) {
      let { data } = await axios.get(baseUrl + horoscope);
      const $ = cheerio.load(data);
      collection[horoscope] = {
        display: utils.titleCase(horoscope),
        summary: $(".row")
          .find(".col-sm-9")
          .find("p:first-child")
          .text()
      };
    }
    return collection;
  }

  async process() {
    let details = await this.scrapHoroscope();
    let result = await utils.uploadData({
      path: "/misc",
      data: {
        name: "horoscope",
        data: details
      }
    });

    return result;
  }
}

module.exports = new Horoscope();
