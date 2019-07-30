const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");
const moment = require("moment");
const CrawlUtils = require("./utils");

let baseUrl = "http://www.nepalstock.com/";

class market {
  constructor() {}
  async scrape() {
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
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
            value: $(this)
              .find("td")
              .eq(1)
              .text()
              .trim(),
            change: $(this)
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
            value: $(this)
              .find("td")
              .eq(1)
              .text()
              .trim(),
            change: $(this)
              .find("td")
              .eq(2)
              .text()
              .trim()
          };
      });
    market_summary = {
      state: $("#top-notice-bar")
        .text()
        .trim()
        .replace("Market ", ""),
      total_turnover: market_summary.eq(1).text(),
      traded_shares: market_summary.eq(3).text(),
      total_transactions: market_summary.eq(5).text(),
      total_scrips_traded: market_summary.eq(7).text(),
      nepse: indices.find(d => d.index == "NEPSE"),
      sensitive: indices.find(d => d.index == "Sensitive"),
      float: indices.find(d => d.index == "Float"),
      float_sensitive: indices.find(d => d.index == "Sen. Float"),
      si_banking: sub_indices.find(d => d.index == "Banking"),
      si_trading: sub_indices.find(d => d.index == "Trading"),
      si_hotels: sub_indices.find(d => d.index == "Hotels"),
      si_devbank: sub_indices.find(d => d.index == "Development Bank"),
      si_hydro: sub_indices.find(d => d.index == "HydroPower"),
      si_finance: sub_indices.find(d => d.index == "Finance"),
      si_nonlife: sub_indices.find(d => d.index == "Non Life Insurance"),
      si_manu: sub_indices.find(d => d.index == "Manu.& Pro."),
      si_others: sub_indices.find(d => d.index == "Others"),
      si_microfinance: sub_indices.find(d => d.index == "Microfinance"),
      si_life: sub_indices.find(d => d.index == "Life Insurance"),
      si_mutual: sub_indices.find(d => d.index == "Mutual Fund")
    };
    return market_summary;
  }
  async process() {
    let details = await this.scrape();

    let data = await CrawlUtils.uploadData({
      path: "/misc",
      data: {
        name: "market",
        data: details
      }
    });

    return data;
  }
}

module.exports = new market();
