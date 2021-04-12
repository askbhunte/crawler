let axios = require("axios");
let cheerio = require("cheerio");
const CrawlUtils = require("./utils");

let baseUrl = "https://www.worldometers.info/coronavirus/";

class Crawler {
  constructor() {}
  async scrape() {
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    let retData = [];
    $("#main_table_countries_today>tbody:nth-child(2)>tr").each(function(i, elem) {
      retData.push({
        country: $(this)
          .find("td")
          .eq(1)
          .text()
          .trim()
          .replace("Total:", ""),
        totalCases: parseInt(
          $(this)
            .find("td")
            .eq(2)
            .text()
            .trim()
            .replace(/,/gi, "")
        )
          ? parseInt(
              $(this)
                .find("td")
                .eq(2)
                .text()
                .trim()
                .replace(/,/gi, "")
            )
          : 0,
        newCases: parseInt(
          $(this)
            .find("td")
            .eq(3)
            .text()
            .trim()
            .replace(",", "")
        )
          ? parseInt(
              $(this)
                .find("td")
                .eq(3)
                .text()
                .trim()
                .replace(/,/gi, "")
            )
          : 0,
        totalDeaths: parseInt(
          $(this)
            .find("td")
            .eq(4)
            .text()
            .trim()
            .replace(",", "")
        )
          ? parseInt(
              $(this)
                .find("td")
                .eq(4)
                .text()
                .trim()
                .replace(/,/gi, "")
            )
          : 0,
        newDeaths: parseInt(
          $(this)
            .find("td")
            .eq(5)
            .text()
            .trim()
            .replace(",", "")
        )
          ? parseInt(
              $(this)
                .find("td")
                .eq(5)
                .text()
                .trim()
                .replace(/,/gi, "")
            )
          : 0,
        activeCases: parseInt(
          $(this)
            .find("td")
            .eq(7)
            .text()
            .trim()
            .replace(",", "")
        )
          ? parseInt(
              $(this)
                .find("td")
                .eq(7)
                .text()
                .trim()
                .replace(/,/gi, "")
            )
          : 0,
        totalRecovered: parseInt(
          $(this)
            .find("td")
            .eq(6)
            .text()
            .trim()
            .replace(",", "")
        )
          ? parseInt(
              $(this)
                .find("td")
                .eq(6)
                .text()
                .trim()
                .replace(/,/gi, "")
            )
          : 0,
        criticalCases: parseInt(
          $(this)
            .find("td")
            .eq(8)
            .text()
            .trim()
            .replace(",", "")
        )
          ? parseInt(
              $(this)
                .find("td")
                .eq(8)
                .text()
                .trim()
                .replace(/,/gi, "")
            )
          : 0
      });
    });
    return retData;
  }
  async process() {
    let data = await this.scrape();
    let resData = await CrawlUtils.uploadData({
      path: "/corona",
      data
    });
    return resData.length;
  }
}

module.exports = new Crawler();
