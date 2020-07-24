const config = require("config");
const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");

let botUrl = config.get("services.nepalbot.url");
let url = 'https://kathmandupost.com/horoscope';
// let url = "https://thehimalayantimes.com/category/lifestyle/horoscopes";
let name = "HOR";
// let horoscopes = [
//   "libra",
//   "aries",
//   "leo",
//   "virgo",
//   "scorpio",
//   "sagittarius",
//   "capricorn",
//   "aquarius",
//   "pisces",
//   "gemini",
//   "cancer",
//   "taurus"
// ];
module.exports = () => {
  // horoscopes.forEach(horoscope => {
  //   let scraper = new ScraperClient({
  //     name,
  //     repo: {
  //       url: botUrl + "/horoscope/feed"
  //     }
  //   });
  //   return scraper.process({
  //     target: { url: url + "/" + horoscope },
  //     extractor: $ => {
  //       var data = {
  //         horoscope,
  //         image_url: $(".row")
  //           .find(".wp-caption")
  //           .find("img")
  //           .attr("src"),
  //         summary: $(".row")
  //           .find(".col-sm-9")
  //           .find("p:first-child")
  //           .text()
  //       };
  //       return data;
  //     }
  //   });
  // });
  let scraper = new ScraperClient({
    name,
    repo: {
      url: botUrl + "/horoscope/feed"
    }
  });
  return scraper.process({
    target: { url },
    extractor: $ => {
      var data = [];
      $(".horoscope .col-md-6").each(function (i, elem) {
        data[i] = {
          horoscope: $(this)
            .find("h5")
            .text()
            .trim(),
          summary: $(this)
            .find('p')
            .text()
            .trim()
        };
      });
      return { data };
    }
  });
};
