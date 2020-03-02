const axios = require("axios");
const config = require("config");
var Twitter = require("twitter");
const CrawlUtils = require("./utils");

const fs = require("fs");
let dataFile = __dirname + "/../config/data.json";

let baseUrl = "https://nrb.org.np/exportForexJSON.php";

class Forex {
  async scrapeForex() {
    let { data } = await axios.get(baseUrl);
    return data.Conversion.Currency;
  }
  async process() {
    let forexData = await this.scrapeForex();
    let forexList = await CrawlUtils.uploadData({
      path: "/forex/feed",
      data: forexData
    });

    this.tweet();

    return forexList.length;
  }

  async tweet() {
    let prevData = this.getPreviousData();
    let data = await this.scrapeForex();

    data = data.filter(d => ["USD", "GBP", "EUR", "AUD"].includes(d.BaseCurrency));
    data = data.reduce((result, item) => {
      let rate = parseFloat(item.TargetBuy);
      result[item.BaseCurrency] = rate;
      return result;
    }, {});
    var client = new Twitter(config.get("services.twitter"));

    let status = `1 USD = NRs: ${data.USD + this.getDiff(data.USD, prevData.forex.USD)}
1 AUD = NRs. ${data.AUD + this.getDiff(data.AUD, prevData.forex.AUD)}
1 EUR =  NRs. ${data.EUR + this.getDiff(data.EUR, prevData.forex.EUR)}
1 GBP =  NRs. ${data.GBP + this.getDiff(data.GBP, prevData.forex.GBP)}
    
#dollar #rate #nepal #forex #currency #usd #aud #nepali #rupee`;

    client.post("statuses/update", { status }, function(error, tweets, response) {
      if (!error) {
        prevData.forex = data;
        fs.writeFileSync(dataFile, JSON.stringify(prevData));
      } else {
        console.log(error);
      }
    });
    return data;
  }

  getDiff(current, prev) {
    if (!prev) prev = current;
    if (current > prev) return "👆🏻";
    else if (prev > current) return "👇🏻";
    else return "";
  }

  getPreviousData() {
    let prevData = {};
    try {
      prevData = fs.readFileSync(dataFile);
      prevData = JSON.parse(prevData);
      prevData = prevData;
    } catch (e) {
      console.log(e);
    }
    return prevData;
  }
}

module.exports = new Forex();
