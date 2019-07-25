const axios = require("axios");
const cheerio = require("cheerio");
const CrawlUtils = require("./utils");
let baseUrl = "https://www.grandehospital.com/doctors/search?page=";
class Grande {
  async pagination() {
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    let page = $(".pagination")
      .find("li")
      .find("a").length;
    return page;
  }
  async grandeDoc() {
    let arr = [];
    for (let i = 1; i <= (await this.pagination()); i++) {
      let { data } = await axios.get(baseUrl + i);
      const $ = cheerio.load(data);
      $(".col-md-3,col-sm-4,col-xs-6").each(function(i, elem) {
        if (
          $(this)
            .find("h2")
            .text() &&
          !undefined
        )
          arr[i] = {
            name: $(this)
              .find("h2")
              .text(),

            desc: $(this)
              .find("p")
              .text()
              .replace(/[\n\t]/g, "")
              .trim(),
            img_url: $(this)
              .find("img")
              .attr("src")
              .replace(/\s/g, "%20"),
            url: $(this)
              .find("a")
              .attr("href")
          };
      });
      arr = arr.filter(el => {
        return el != null;
      });
      arr.push(...arr);
      console.log(arr);
    }
    return arr;
  }
  async process() {
    let grandeDoc = await this.grandeDoc();
    await CrawlUtils.uploadData({
      path: "/doctors",
      data: grandeDoc
    });
    return grandeDoc.length;
  }
}
module.exports = new Grande();
