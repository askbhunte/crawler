const config = require("config");
const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");

let botUrl = config.get("services.nepalbot.url");
let url = "http://www.fenegosida.org/";
module.exports = async () => {
  let scraper = new ScraperClient({
    name: "BUL",
    repo: {
      url: botUrl + "/bullion/feed"
    }
  });
  return scraper.process({
    target: { url },
    extractor: $ => {
      let bullionArr = [];
      $("#header-rate:nth-child(1)")
        .find("div")
        .each(function(i, elem) {
          bullionArr[i] = {
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
      bullionArr = bullionArr.splice(4, 6);
      let date =
        -$(".rate-date")
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
      bullionArr.forEach(element => {
        if (element.title.toLowerCase().includes("gold")) {
          element.image_url = "http://all4desktop.com/data_images/original/4241648-gold.jpg";
        } else {
          element.image_url = "https://www.outlawz.ch/resources/Silversilberbarren.jpg";
        }
        element.date = date;
        element.title = element.title.replace(/[/-]/g, "");
      });
      bullionArr = bullionArr.filter(el => el.title != "");
      return bullionArr;
    }
  });
};
