const axios = require("axios");
const https = require("https");
const config = require("config");
let Twitter = require("twitter");
const utils = require("./utils");
const cheerio = require("cheerio");

const fs = require("fs");
let dataFile = __dirname + "/../config/data.json";

let baseUrl = "https://www.nrb.org.np/forex";

class Forex {
  async scrapeForex() {
    var instance = axios.create({
      baseURL: baseUrl,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });
    let { data } = await instance.get(baseUrl);
    const $ = cheerio.load(data);
    let retData = [];
    $(".table-forex")
      .find("tr")
      .each(function (i, elem) {
        retData.push({
          BaseCurrency: $(this)
            .find(".d-flex")
            .find(".ml-2")
            .text()
            .split(" ")[0]
            .trim()
            .toUpperCase(),
          TargetCurrency: "NPR",
          TargetBuy: $(this).find("td:nth-child(3)").text(),
          BaseValue: $(this).find("td:nth-child(2)").text(),
          TargetSell: $(this).find("td:nth-child(4)").text(),
          Date: new Date()
        });
      });
    retData = retData.filter(d => d.BaseCurrency);
    return retData;
  }
  async process() {
    let forexData = await this.scrapeForex();
    let forexList = await utils.uploadData({
      path: "/forex/feed",
      data: forexData
    });

    this.tweet();

    return forexData;
  }

  async tweet() {
    let prevData = utils.getDataFromFile(dataFile);
    let data = await this.scrapeForex();

    data = data.filter(d => ["USD", "GBP", "EUR", "AUD"].includes(d.BaseCurrency));
    data = data.reduce((result, item) => {
      let rate = parseFloat(item.TargetBuy);
      result[item.BaseCurrency] = rate;
      return result;
    }, {});
    var client = new Twitter(config.get("services.twitter"));

    let status = `1 USD = NRs: ${data.USD + utils.getChangeEmoji(data.USD, prevData.forex.USD)}
  1 AUD = NRs. ${data.AUD + utils.getChangeEmoji(data.AUD, prevData.forex.AUD)}
  1 EUR =  NRs. ${data.EUR + utils.getChangeEmoji(data.EUR, prevData.forex.EUR)}
  1 GBP =  NRs. ${data.GBP + utils.getChangeEmoji(data.GBP, prevData.forex.GBP)}

  #dollar #rate #nepal #forex #currency #usd #aud #nepali #rupee`;

    client.post("statuses/update", { status }, function (error, tweets, response) {
      if (!error) {
        prevData.forex = data;
        fs.writeFileSync(dataFile, JSON.stringify(prevData));
      } else {
        console.log(error);
      }
    });
    return data;
  }
}

module.exports = new Forex();
