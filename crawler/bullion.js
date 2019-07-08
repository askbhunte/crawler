const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");
const moment = require("moment");

let botUrl = config.get("services.nepalbot.url");
let baseUrl = "http://www.fenegosida.org/";

let setup = {
  init: async () => {
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    data = [];
    $("#header-rate:nth-child(1)")
      .find("div")
      .each(function(i, elem) {
        data[i] = {
          title: $(this)
            .find("p")
            .clone()
            .children()
            .remove()
            .end()
            .text(),
          rate: $(this)
            .find("p")
            .find("b")
            .text()
        };
      });
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
      if (el.title.toLowerCase().includes("gold")) {
        el.image_url = "http://all4desktop.com/data_images/original/4241648-gold.jpg";
      } else {
        el.image_url = "https://www.outlawz.ch/resources/Silversilberbarren.jpg";
      }
      el.date = date;
      el.title = el.title.replace(/[/-]/g, "");
    });
    data = data.splice(4, 6);
    await axios({ method: "POST", url: botUrl + "/bullion/feed", data: data });
  }
};

setup.init();
