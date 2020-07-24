const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");

let baseUrl = "https://kathmandupost.com/horoscope";
const utils = require("./utils");

let horoscopes = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

class Horoscope {
  constructor() { }

  async scrapHoroscope() {
    let collection = {};
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    $(".horoscope .col-md-6").each(function (i, elem) {
      collection[horoscopes[i]] = {
        display: $(this)
          .find("h5")
          .text()
          .trim(),
        summary: $(this)
          .find('p')
          .text()
          .replace(/\*/g, '')
          .trim()
      };
    });
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
