const config = require("config");
const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");

let botUrl = config.get("services.nepalbot.url");
let url = "https://www.sharesansar.com/today-share-price";

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
        .find("tr")
        .each(function(i, elem) {
          if (
            $(this)
              .find("td:nth-child(2)")
              .find("a")
              .text() &&
            $(this)
              .find("td:nth-child(7)")
              .text() !== ""
          )
            data[i] = {
              traded_company: $(this)
                .find("td:nth-child(2)")
                .find("a")
                .text(),
              symbol: $(this)
                .find("td:nth-child(3)")
                .find("a")
                .text(),
              close: $(this)
                .find("td:nth-child(7)")
                .text(),
              prev_close: $(this)
                .find("td:nth-child(9)")
                .text(),
              diff: $(this)
                .find("td:nth-child(12)")
                .text()
            };
        });
      return data.filter(el => el != null);
    }
  });
};
