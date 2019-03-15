const config = require("config");
const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");

let boturl = config.get("services.nepalbot.url");
let url = "https://thehimalayantimes.com/category";
let name = "THT";

module.exports = async category => {
  let scraper = new ScraperClient({
    name,
    repo: {
      url: boturl + "/news/feed"
    }
  });

  return scraper.process({
    target: { url: url + "/" + category },
    extractor: $ => {
      var data = [];
      $(".mainNews")
        .find("li")
        .each(function(i, elem) {
          if (
            $(this)
              .find("p")
              .text() !== ""
          )
            data[i] = {
              source: name,
              category,
              title:
                $(this)
                  .find("h3")
                  .find("a")
                  .text() ||
                $(this)
                  .find("h4")
                  .find("a")
                  .text(),
              url:
                $(this)
                  .find("h3")
                  .find("a")
                  .attr("href") ||
                $(this)
                  .find("h4")
                  .find("a")
                  .attr("href"),
              img_url:
                $(this)
                  .find("img")
                  .attr("data-lazy-src") || null,
              summary: $(this)
                .find("p")
                .text()
                .trim()
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
