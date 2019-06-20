const config = require("config");
const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");

let botUrl = config.get("services.nepalbot.url");
let url = "http://www.nepalstock.com/todaysprice?_limit=500";

module.exports = async () => {
  let scraper = new ScraperClient({
    name: "STK",
    repo: {
      url: botUrl + "/stock/feed"
    }
  });

  return scraper.process({
    target: { url },
    extractor: $ => {
      let data = [];
      $("table")
        .find("tr:not(:first-child,:nth-child(2))")
        .each(function(i, elem) {
          data[i] = {
            traded_company: $(this)
              .find("td")
              .eq(1)
              .text(),
            close: $(this)
              .find("td")
              .eq(5)
              .text(),

            prev_close: $(this)
              .find("td")
              .eq(8)
              .text(),
            diff: $(this)
              .find("td")
              .eq(9)
              .text()
              .replace(/[\n]| +/g, "")
          };
        });
      return data.filter(el => el != null);
    }
  });
};

// let sample = {
//   last_trade_date: "",
//   is_market_open: true,
//   total_turnover: "34925777",
//   ...config,
//   indices: []
// };
