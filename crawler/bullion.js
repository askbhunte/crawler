const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");
const moment = require("moment");
const CrawlUtils = require("./utils");

let baseUrl = "http://www.fenegosida.org/";

class Bullion {
  constructor() {}
  async scrapeBullion() {
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    data = [];
    $("#header-rate:nth-child(1)")
      .find("div")
      .each(function(i, elem) {
        data[i] = {
          title: $(this)
            .find("p")
            .clone()
            .children()
            .remove()
            .end()
            .text(),
          rate: $(this)
            .find("p")
            .find("b")
            .text()
        };
      });
    data = data.splice(0, 3);

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
      if (el.title.toLowerCase().includes("gold")) {
        el.image_url = "http://all4desktop.com/data_images/original/4241648-gold.jpg";
      } else {
        el.image_url = "https://www.outlawz.ch/resources/Silversilberbarren.jpg";
      }
      el.date = date;
      el.title = el.title.replace(/[/-]/g, "");
    });
    return data;
  }
  async process() {
    let bullionList = await this.scrapeBullion();
    await CrawlUtils.uploadData({
      path: "/bullion",
      data: bullionList
    });

    return bullionList.length;
  }
}
module.exports = new Bullion();
