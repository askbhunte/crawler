const config = require("config");
const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");

let boturl = config.get("services.nepalbot.url");
let url = "http://kathmandupost.ekantipur.com/category";
let name = "TKP";
let categories = ["sports", "national", "technology", "world", "escalate", "health-living"];

module.exports = async () => {
  categories.forEach(category => {
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
        $(".col-md-4").each(function(i, elem) {
          if (
            $(this)
              .find(".wrap")
              .find("a")
              .text() !== ""
          )
            data[i] = {
              source: name,
              category,
              title: $(this)
                .find(".wrap")
                .find("h2")
                .text(),
              img_url:
                $(this)
                  .find("img")
                  .attr("data-original") ||
                "http://nextgrowthconclave.com/wp-content/uploads/2017/11/KathmanduPost-50.jpg",
              url:
                "http://kathmandupost.ekantipur.com/" +
                $(this)
                  .find(".wrap")
                  .find("a")
                  .attr("href"),
              summary: $(this)
                .find(".teaser")
                .text()
            };
        });
        if (data.length === 0)
          $(".col-md-6").each(function(i, elem) {
            if (
              $(this)
                .find(".item-wrap")
                .find("h2")
                .text() !== ""
            )
              data[i] = {
                source: name,
                category,
                title: $(this)
                  .find(".item-wrap")
                  .find("h2")
                  .text(),
                img_url:
                  $(this)
                    .find("img")
                    .attr("data-original") ||
                  "http://nextgrowthconclave.com/wp-content/uploads/2017/11/KathmanduPost-50.jpg",
                url:
                  "http://kathmandupost.ekantipur.com/" +
                  $(this)
                    .find(".item-wrap")
                    .find("a")
                    .attr("href"),
                summary: $(this)
                  .find(".teaser")
                  .text()
              };
          });
        data = data.filter(d => d.source != undefined);
        return {
          source: name,
          category,
          data
        };
      }
    });
  });
};
