const config = require("config");
const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");

let botUrl = config.get("services.nepalbot.url");
let url = "http://www.nepalstock.com";

let dataInForm = data => {
  let a = data.split(" ");
  let array = [];
  for (var d = 0; d < a.length; d++) {
    let symbol = a[d + 0];
    let high = a[d + 1];
    let volume = a[d + 3];
    let fluctuation = a[d + 7];
    array.push({ symbol, high, volume, fluctuation });
    d = d + 10;
  }
  return array;
};

module.exports = async () => {
  let scraper = new ScraperClient({
    name: "STK",
    repo: {
      url: botUrl + "/stock/feed"
    }
  });

  return scraper.process({
    target: { url },
    extractor: async $ => {
      let data = [];
      data = $("marquee").text();
      data = await dataInForm(data);
      return data.filter(el => el != null);
    }
  });
};
