const config = require("config");
const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");

let date = new Date();
let year = date.getFullYear();
let botUrl = config.get("services.nepalbot.url");
let url = `https://publicholidays.asia/nepal/${year}-dates/#`;

module.exports = async () => {
  let scraper = new ScraperClient({
    name: "HLD",
    repo: {
      url: botUrl + "/holiday/feed"
    }
  });

  return scraper.process({
    target: { url },
    extractor: $ => {
      let holidayArr = [];
      $("table")
        .find("tr")
        .each(function(i, elem) {
          if (
            $(this)
              .find("td")
              .eq(2)
              .text() !== ""
          )
            holidayArr[i] = {
              holiday_date: $(this)
                .find("td:first-child")
                .text()
                .trim(),
              holiday_day: $(this)
                .find("td")
                .eq(1)
                .text()
                .trim(),
              holiday_desc: $(this)
                .find("td")
                .eq(2)
                .text()
                .trim()
            };
        });
      let trimmerData = holidayArr.filter(n => n != undefined);
      return trimmerData;
    }
  });
};
