const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");

let botUrl = config.get("services.nepalbot.url");
let baseUrl = "https://nepalipatro.com.np/";

class Holiday {
  async scrapHoliday() {
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    data = [];
    $(".calandergrid")
      .find(".caltd")
      .each(function(i, elem) {
        data[i] = {
          day: $(this)
            .find(".cdateDay")
            .text()
            .replace("\n", " ")
            .replace(/\n$/, ""),
          bottom: $(this)
            .find(".cdatebottom")
            .text(),
          top: $(this)
            .find(".cdatebottom")
            .text(),
          left: $(this)
            .find(".cdatebottom")
            .text(),
          right: $(this)
            .find(".cdatebottom")
            .text(),
          cdateDayAdFull: $(this)
            .find(".cdateDayAdFull")
            .text()
        };
      });
  }
  async process() {
    let holidayList = await this.scrapHoliday();
    await CrawlUtils.uploadData({
      path: "/holiday",
      data: holidayList
    });

    return holiday.length;
  }
}

module.exports = new Holiday();
