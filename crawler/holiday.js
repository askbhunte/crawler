const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");

let botUrl = config.get("services.nepalbot.url");
let baseUrl = "https://nepalipatro.com.np/";

let setup = {
  init: async () => {
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    data = [];
    $(".calandergrid")
      .find(".caltd")
      .each(function(i, elem) {
        data[i] = {
          day: $(this)
            .find(".cdateDay")
            .text()
            .replace("\n", " ")
            .replace(/\n$/, ""),
          bottom: $(this)
            .find(".cdatebottom")
            .text(),
          top: $(this)
            .find(".cdatebottom")
            .text(),
          left: $(this)
            .find(".cdatebottom")
            .text(),
          right: $(this)
            .find(".cdatebottom")
            .text(),
          cdateDayAdFull: $(this)
            .find(".cdateDayAdFull")
            .text()
        };
      });
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
