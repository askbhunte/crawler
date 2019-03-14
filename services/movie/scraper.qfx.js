const config = require("config");
const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");

let botUrl = config.get("services.nepalbot.url");
let url = "http://www.qfxcinemas.com";

module.exports = async () => {
  let scraper = new ScraperClient({
    name: "QFX",
    repo: {
      url: botUrl + "/movies/feed"
    }
  });

  return scraper.process({
    target: { url },
    extractor: $ => {
      var current = [];
      var upcoming = [];
      $(".movie").each(function(i, elem) {
        if (
          $(this)
            .find(".movie-date")
            .text() === ""
        ) {
          current[i] = {
            title: $(this)
              .find(".movie-title")
              .text(),
            url:
              url +
              $(this)
                .find(".movie-poster")
                .find(".ticket")
                .attr("href"),
            imagesrc:
              url +
              "/" +
              $(this)
                .find(".movie-poster")
                .find(".img-b")
                .attr("src")
          };
        } else {
          upcoming[i] = {
            title: $(this)
              .find(".movie-title")
              .text(),
            releasedate: $(this)
              .find(".movie-date")
              .text()
              .replace(/[\n]/g, ""),
            url:
              url +
              $(this)
                .find(".movie-poster")
                .find("a")
                .attr("href"),
            imagesrc:
              url +
              $(this)
                .find(".movie-poster")
                .find(".img-b")
                .attr("src")
          };
        }
      });
      let filteredupcoming = upcoming.filter(element => {
        return Boolean(element);
      });

      return { current, upcoming: filteredupcoming };
    }
  });
};
