const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");
const moment = require("moment");
const utils = require("./utils");

const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

let baseUrl = "http://kalimatimarket.gov.np/home/rpricelist";

class Vegetable {
  constructor() { }
  async scrape() {
    await axios.get("http://kalimatimarket.gov.np/home/language/EN", { jar: cookieJar, withCredentials: true })

    let { data } = await axios.get(baseUrl, { jar: cookieJar, withCredentials: true });
    const $ = cheerio.load(data);
    data = [];
    $("table")
      .find("tr")
      .each(function (i, elem) {
        data[i] = {
          name: $(this)
            .find("td:nth-child(1)")
            .text()
            .trim(),
          unit: $(this)
            .find("td:nth-child(2)")
            .text()
            .trim(),
          min: $(this)
            .find("td:nth-child(3)")
            .text()
            .trim(),
          max: $(this)
            .find("td:nth-child(4)")
            .text()
            .trim(),
          avg: $(this)
            .find("td:nth-child(5)")
            .text()
            .trim()
        };
      });

    return data;
    data = data.splice(4, 3);

    let date =
      $(".rate-date")
        .find(".rate-date-day")
        .text() +
      " " +
      $(".rate-date")
        .find(".rate-date-month")
        .text() +
      " " +
      $(".rate-date")
        .find(".rate-date-year")
        .text();

    data.forEach(el => {
      el.name = utils.titleCase(el.name);
      el.name = el.name.replace(/[/-]/g, "");
      el.name = el.name.trim();
    });

    return payload;
  }
  async process() {
    let data = await this.scrape();
    data = await utils.uploadData({
      path: "/commodity",
      data
    });
    return data;
  }
}
module.exports = new Vegetable();
