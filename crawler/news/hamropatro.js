const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");
const moment = require("moment");
const CrawlUtils = require("../utils");

let baseUrl = "https://www.hamropatro.com/news";

class crawler {
  constructor() {}
  async scrape() {
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    let news = [];
    $(".newsCard").each(function(i, elem) {
      news.push({
        source_id: $(this)
          .find(".newsInfo>h2>a")
          .attr("href")
          .trim()
          .replace(/\/news\/details\//, "")
          .replace(/\?ns=/, ""),
        title: $(this)
          .find(".newsInfo>h2>a")
          .text()
          .trim(),
        img_url: $(this)
          .find("img")
          .attr("src"),
        summary: $(this)
          .find(".newsSummary")
          .text()
          .trim(),
        source: $(this)
          .find(".newsSource")
          .html()
          .split("\n")[1]
          .split("<span")[0]
          .trim(),
        time: $(this)
          .find(".newsSource>span")
          .eq(0)
          .text()
          .split(". ")[1]
          .trim(),
        url: $(this)
          .find(".newsSource>span")
          .eq(1)
          .attr("href"),
        author: "Hamropatro",
        category: "misc"
      });
    });
    return news;
  }

  async process() {
    let details = await this.scrape();
    let data = await CrawlUtils.uploadData({
      path: "/news/hamropatro",
      data: details
    });

    return data;
  }
}

module.exports = new crawler();
