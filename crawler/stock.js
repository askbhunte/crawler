const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");
const moment = require("moment");
const CrawlUtils = require("./utils");

let baseUrl = "http://www.nepalstock.com/";

class QFX {
  constructor() {}
  async scrapStockList() {
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    data = [];
    $("table")
      .find("tr:not(:first-child,:nth-child(2))")
      .each(function(i, elem) {
        data[i] = {
          name: $(this)
            .find("td")
            .eq(1)
            .text(),
          transactions: $(this)
            .find("td")
            .eq(2)
            .text(),
          max_price: $(this)
            .find("td")
            .eq(3)
            .text(),
          min_price: $(this)
            .find("td")
            .eq(4)
            .text(),
          close: $(this)
            .find("td")
            .eq(5)
            .text(),
          prev_close: $(this)
            .find("td")
            .eq(5)
            .text(),
          volume: $(this)
            .find("td")
            .eq(6)
            .text(),
          amount: $(this)
            .find("td")
            .eq(7)
            .text(),
          yday_close: $(this)
            .find("td")
            .eq(8)
            .text(),
          difference: $(this)
            .find("td")
            .eq(9)
            .text()
            .replace(/[\n]| +/g, "")
        };
      });

    data = data.filter(el => el != null);
    let companies = fs.readFileSync(__dirname + "/companies.json");
    companies = JSON.parse(companies);
    data = data.map(d => {
      let match = companies.find(c => c.name == d.name);
      if (match) {
        d.symbol = match.symbol;
        return d;
      } else null;
    });
    data = data.filter(el => el != null);
    //replace with live data
    let liveData = $("marquee").text();
    liveData = liveData.split(")  ");
    liveData = liveData.map(d => {
      let str = d.trim();
      str = str.replace("( ", "");
      str = str.replace(" ) (  ", " ");
      let arr = str.split(" ");
      return {
        symbol: arr[0],
        close: arr[1] ? arr[1].replace(",", "") : arr[1],
        volume: arr[2] ? arr[2].replace(",", "") : arr[2],
        difference: arr[3]
      };
    });
    let date = $("#date").html();
    date = date.replace("As of ", "");
    date = date.replace("&#xA0;&#xA0;  ", "");
    date = date.replace(" &#xA0;&#xA0; ", "");

    data = data.map(d => {
      let match = liveData.find(c => c.symbol == d.symbol);
      if (match) {
        d.close = match.close;
        d.volume = match.volume;
        d.difference = match.difference;
      }
      d.updated_at = date;
      return d;
    });

    data = data.filter(el => el != null);
    return data;
  }
  async process() {
    let stockList = await this.scrapStockList();
    await CrawlUtils.uploadData({
      path: "/stock",
      data: stockList
    });

    return stockList.length;
  }
}

module.exports = new QFX();
