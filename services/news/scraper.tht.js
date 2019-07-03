const config = require("config");
const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");

let boturl = config.get("services.nepalbot.url");
let url = "https://thehimalayantimes.com/category";
let name = "THT";
let category;
let categories = [
  "kathmandu",
  "business",
  "sports",
  "world",
  "nepal",
  "education",
  "entertainment",
  "environment",
  "science-technology",
  "opinion"
];
module.exports = async () => {
  categories.forEach(payload => {
    let scraper = new ScraperClient({
      name,
      repo: {
        url: boturl + "/news/feed"
      }
    });
    return scraper.process({
      target: { url: url + "/" + payload },
      extractor: $ => {
        if (payload === "nepal") {
          category = "national";
        } else if (payload === "entertainment") {
          category = "variety";
        } else if (payload === "science-technology") {
          category = "technology";
        } else {
          category = payload;
        }

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
  });
};
