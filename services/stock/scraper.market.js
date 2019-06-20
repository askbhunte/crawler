const config = require("config");
const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");

let botUrl = config.get("services.nepalbot.url");
let url = "http://www.nepalstock.com/";

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
      try {
        let indices = [];
        let sub_indices = [];
        //SUMMARY
        let market_summary = $($("table")[8])
          .find("tbody")
          .find("td");
        //INDICES
        $($("table")[9])
          .find("tbody")
          .find("tr")
          .each(function(i, elem) {
            if (
              $(this)
                .find("td")
                .eq(0)
                .text()
                .trim() !== ""
            )
              indices[i] = {
                index: $(this)
                  .find("td")
                  .eq(0)
                  .text()
                  .trim(),
                current: $(this)
                  .find("td")
                  .eq(1)
                  .text()
                  .trim(),
                points_change: $(this)
                  .find("td")
                  .eq(2)
                  .text()
                  .trim()
              };
          });
        //SUB-INDICES
        $($("table")[10])
          .find("tbody")
          .find("tr")
          .each(function(i, elem) {
            if (
              $(this)
                .find("td")
                .eq(0)
                .text()
                .trim() !== ""
            )
              sub_indices[i] = {
                index: $(this)
                  .find("td")
                  .eq(0)
                  .text()
                  .trim(),
                current: $(this)
                  .find("td")
                  .eq(1)
                  .text()
                  .trim(),
                points_change: $(this)
                  .find("td")
                  .eq(2)
                  .text()
                  .trim()
              };
          });
        market_summary = {
          market_status: $("#top-notice-bar")
            .text()
            .trim(),
          total_turnover: market_summary.eq(1).text(),
          traded_shares: market_summary.eq(3).text(),
          total_transactions: market_summary.eq(5).text(),
          total_scrips_traded: market_summary.eq(7).text(),
          indices,
          sub_indices
        };
        return market_summary;
      } catch (error) {
        console.log(error);
      }
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
