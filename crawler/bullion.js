const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");
const moment = require("moment");
const utils = require("./utils");

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

    return data;
  }
}
module.exports = new Bullion();
