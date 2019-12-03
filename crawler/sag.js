let axios = require("axios");
let cheerio = require("cheerio");
const CrawlUtils = require("./utils");

let baseUrl = "https://www.13sagnepal.com/medal-count/";

class crawler {
  constructor() {}
  async scrape() {
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    let retData = [];
    $("#myTable > tbody > tr").each(function(i, elem) {
      retData.push({
        Country: $(this)
          .find("td")
          .eq(0)
          .text()
          .trim(),
        Gold: parseInt(
          $(this)
            .find("td")
            .eq(2)
            .text()
            .trim()
        ),
        Silver: parseInt(
          $(this)
            .find("td")
            .eq(3)
            .text()
            .trim()
        ),
        Bronze: parseInt(
          $(this)
            .find("td")
            .eq(4)
            .text()
            .trim()
        ),
        Total: parseInt(
          $(this)
            .find("td")
            .eq(5)
            .text()
            .trim()
        )
      });
    });
    return retData;
  }
  async process() {
    let data = await this.scrape();
    let resData = await CrawlUtils.uploadData({
      path: "/temp?name=sag",
      data
    });

    console.log(resData);
    return resData;
  }
}

module.exports = new crawler();
