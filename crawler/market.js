const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");
const moment = require("moment");
const CrawlUtils = require("./utils");
var Twitter = require("twitter");

let baseUrl = "http://www.nepalstock.com/";

class market {
  constructor() {}
  async scrape() {
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    let indices = [];
    let sub_indices = [];
    //SUMMARY
    let market_summary = $("#market-watch > div.panel-body > table")
      .find("tbody")
      .find("td");
    //INDICES
    $("#nepse-stats > div:nth-child(3) > div.panel-body > table:nth-child(1)")
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
            name: $(this)
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
              .trim(),
            percent_change: $(this)
              .find("td")
              .eq(3)
              .text()
              .trim(),
            status: $(this)
              .find("img")
              .attr("src")
              .trim()
              .replace("./images/", "")
              .replace(".gif", "")
          };
      });
    //SUB-INDICES
    $("#nepse-stats > div:nth-child(3) > div.panel-body > table:nth-child(2)")
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
            name: $(this)
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
              .trim(),
            percent_change: $(this)
              .find("td")
              .eq(3)
              .text()
              .trim(),
            status: $(this)
              .find("img")
              .attr("src")
              .trim()
              .replace("./images/", "")
              .replace(".gif", "")
          };
      });

    market_summary = {
      state: $("#top-notice-bar")
        .text()
        .trim()
        .replace("Market ", "")
        .toLowerCase(),
      total_turnover: parseInt(
        market_summary
          .eq(1)
          .text()
          .replace(/,/g, "")
      ),
      traded_shares: parseInt(
        market_summary
          .eq(3)
          .text()
          .replace(/,/g, "")
      ),
      total_transactions: parseInt(
        market_summary
          .eq(5)
          .text()
          .replace(/,/g, "")
      ),
      total_scrips_traded: parseInt(
        market_summary
          .eq(7)
          .text()
          .replace(/,/g, "")
      ),
      nepse: this.getIndexData(indices, "NEPSE"),
      sensitive: this.getIndexData(indices, "Sensitive"),
      float: this.getIndexData(indices, "Float"),
      float_sensitive: this.getIndexData(indices, "Sen. Float"),
      si_banking: this.getIndexData(sub_indices, "Banking"),
      si_trading: this.getIndexData(sub_indices, "Trading"),
      si_hotels: this.getIndexData(sub_indices, "Hotels"),
      si_devbank: this.getIndexData(sub_indices, "Development Bank"),
      si_hydro: this.getIndexData(sub_indices, "HydroPower"),
      si_finance: this.getIndexData(sub_indices, "Finance"),
      si_nonlife: this.getIndexData(sub_indices, "Non Life Insurance"),
      si_manu: this.getIndexData(sub_indices, "Manu.& Pro."),
      si_others: this.getIndexData(sub_indices, "Others"),
      si_microfinance: this.getIndexData(sub_indices, "Microfinance"),
      si_life: this.getIndexData(sub_indices, "Life Insurance"),
      si_mutual: this.getIndexData(sub_indices, "Mutual Fund")
    };
    market_summary.is_open = market_summary.state == "open";
    return market_summary;
  }

  getIndexData(index, name) {
    let data = index.find(d => d.name == name);
    try {
      data.value = parseFloat(data.value.replace(/,/g, ""));
      data.change = parseFloat(data.change.replace(/,/g, ""));
      data.percent_change = parseFloat(data.percent_change);
      if (data.status == "decrease") {
        data.change = data.change * -1;
        data.percent_change = data.percent_change * -1;
      }
    } catch (e) {}
    return data;
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

  async tweet() {
    var client = new Twitter(config.get("services.twitter"));

    let data = await this.scrape();
    let indicator = "🟢";
    let plus = "+";
    if (data.nepse.change < 0) {
      indicator = "🔴";
      plus = "";
    }

    let status = `NEPSE:      ${data.nepse.value} (${plus}${data.nepse.change}/${plus}${data.nepse.percent_change}%)
Sensitive:   ${data.sensitive.value} (${plus}${data.sensitive.change}/${plus}${data.sensitive.percent_change}%) 
    
${indicator} #nepse #nepal #stock #nepalstock #market`;

    client.post("statuses/update", { status }, function(error, tweets, response) {
      if (!error) {
      } else {
        console.log(error);
      }
    });
    return status;
  }
}

module.exports = new market();
