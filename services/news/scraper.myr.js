const config = require("config");
const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");

let boturl = config.get("services.nepalbot.url");
let url = "https://myrepublica.nagariknetwork.com/category";
let name = "MYR";
let category;
module.exports = async payload => {
  let scraper = new ScraperClient({
    name,
    repo: {
      url: boturl + "/news/feed"
    }
  });
  return scraper.process({
    target: { url: url + "/" + payload },
    extractor: $ => {
      if (payload === "economy") {
        category = "business";
      } else {
        category = payload;
      }
      console.log(category);
      var data = [];
      $(".categories-list-info").each(function(i, elem) {
        data[i] = {
          source: name,
          category,
          title: $(this)
            .find(".main-heading")
            .find("h2")
            .text(),
          url:
            "https://myrepublica.nagariknetwork.com/" +
            $(this)
              .find(".main-heading")
              .find("a")
              .attr("href"),
          img_url:
            $(this)
              .find("figure")
              .find("img")
              .attr("src") || null,
          summary: $(this)
            .find(".col-sm-8")
            .find("p")
            .text()
            .trim()
            .split("\n")
            .pop()
            .trim()
            .split(":")
            .pop()
        };
      });
      return {
        source: name,
        category,
        data
      };
    }
  });
};
