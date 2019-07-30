const axios = require("axios");
const cheerio = require("cheerio");
const CrawlUtils = require("../utils");
let baseUrl = "https://www.grandehospital.com/doctors/search?page=";
class Grande {
  async totalPages() {
    console.log("+++");
    let { data } = await axios.get(baseUrl + "1");
    const $ = cheerio.load(data);
    return $(".pagination")
      .find("li")
      .find("a").length;
  }

  async listDoctors() {
    const totalPages = await this.totalPages();
    let arr = [];
    for (let i = 1; i < totalPages + 1; i++) {
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
            source: "Grande",
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
    }
    console.log(arr.length);
    return arr;
  }
  async process() {
    let doctors = await this.listDoctors();
    await CrawlUtils.uploadData({
      path: "/doctors",
      data: doctors
    });
    return doctors.length;
  }
}
module.exports = new Grande();
