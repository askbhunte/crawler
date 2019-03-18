const config = require("config");
const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");

let botUrl = config.get("services.nepalbot.url");
let url = "https://www.sharesansar.com/bullion";
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
      $("tr").each(function(i, elem) {
        bullionArr[i] = {
          title: $(this)
            .find("h3")
            .find("u")
            .text()
            .trim(),
          rate: $(this)
            .find("h4")
            .find("p")
            .text()
            .trim()
        };
      });
      let date = $("p")
        .find(".text-org")
        .text();
      bullionArr.forEach(element => {
        if (element.title.toLowerCase().includes("gold")) {
          element.image_url = "http://all4desktop.com/data_images/original/4241648-gold.jpg";
        } else {
          element.image_url = "https://www.outlawz.ch/resources/Silversilberbarren.jpg";
        }
        element.date = date;
      });
      return bullionArr;
    }
  });
};
