const config = require("config");
const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");

let botUrl = config.get("services.nepalbot.url");
let url = "https://thehimalayantimes.com/category/lifestyle/horoscopes";
let name = "HOR";

module.exports = async horoscope => {
  let scraper = new ScraperClient({
    name,
    repo: {
      url: botUrl + "/horoscope/feed"
    }
  });
  return scraper.process({
    target: { url: url + "/" + horoscope },
    extractor: $ => {
      var data = {
        horoscope,
        image_url: $(".row")
          .find(".wp-caption")
          .find("img")
          .attr("src"),
        summary: $(".row")
          .find(".col-sm-9")
          .find("p:first-child")
          .text()
      };
      return data;
    }
  });
};
