const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");
const moment = require("moment");
const utils = require("./utils");
var Twitter = require("twitter");

const fs = require("fs");
let dataFile = __dirname + "/../config/data.json";

let baseUrl = "http://www.fenegosida.org/";

class Bullion {
  constructor() {}
  async scrapeBullion() {
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    data = [];
    $("#header-rate:nth-child(1)")
      .find("div")
      .each(function(i, elem) {
        data[i] = {
          name: $(this)
            .find("p")
            .clone()
            .children()
            .remove()
            .end()
            .text()
            .trim(),
          price: $(this)
            .find("p")
            .find("b")
            .text()
        };
      });
    data = data.splice(4, 3);

    let date =
      $(".rate-date")
        .find(".rate-date-day")
        .text() +
      " " +
      $(".rate-date")
        .find(".rate-date-month")
        .text() +
      " " +
      $(".rate-date")
        .find(".rate-date-year")
        .text();

    data.forEach(el => {
      // if (el.name.toLowerCase().includes("gold")) {
      //   el.data.image_url = "http://all4desktop.com/data_images/original/4241648-gold.jpg";
      // } else {
      //   el.data.image_url = "https://www.outlawz.ch/resources/Silversilberbarren.jpg";
      // }
      el.name = utils.titleCase(el.name);
      el.name = el.name.replace(/[/-]/g, "");
      el.name = el.name.trim();
    });
    let payload = {
      fine_gold: {
        display: data[0].name,
        price: data[0].price,
        date: date
      },
      tejabi_gold: {
        display: data[1].name,
        price: data[1].price,
        date: date
      },
      silver: {
        display: data[2].name,
        price: data[2].price,
        date: date
      }
    };
    return payload;
  }

  async process() {
    let details = await this.scrapeBullion();
    let data = await utils.uploadData({
      path: "/misc",
      data: {
        name: "bullion",
        data: details
      }
    });
    this.tweet();
    return data;
  }

  async tweet() {
    let prevData = utils.getDataFromFile(dataFile);
    let data = await this.scrapeBullion();

    data["FGLD"] = parseInt(data.fine_gold.price);
    data["TGLD"] = parseInt(data.tejabi_gold.price);
    data["SILV"] = parseInt(data.silver.price);

    if (data.FGLD === prevData.bullion.FGLD) return;

    delete data.fine_gold;
    delete data.tejabi_gold;
    delete data.silver;

    var client = new Twitter(config.get("services.twitter"));

    let status = `Fine Gold:     NRs. ${data.FGLD +
      utils.getChangeEmoji(data.FGLD, prevData.bullion.FGLD)}
Tejabi Gold:  NRs. ${data.TGLD + utils.getChangeEmoji(data.TGLD, prevData.bullion.TGLD)}
Silver:           NRs. ${data.SILV + utils.getChangeEmoji(data.SILV, prevData.bullion.SILV)}
    
#gold #silver #price #nepal #fenegosida #bullion #goldnepal (per tola)`;

    client.post("statuses/update", { status }, function(error, tweets, response) {
      if (!error) {
        prevData.bullion = data;
        fs.writeFileSync(dataFile, JSON.stringify(prevData));
      } else {
        console.log(error);
      }
    });
    return data;
  }
}
module.exports = new Bullion();
