const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");
const CrawlUtils = require("./utils");

let botUrl = config.get("services.nepalbot.url");
let baseUrl = "https://www.nepalmediciti.com/FindAPhysician";
let url = "https://www.nepalmediciti.com";
class Mediciti {
  async scrapMediciti() {
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    data = [];
    $(".col-lg-4").each(function(i, elem) {
      data[i] = {
        name: $(this)
          .find("h5")
          .text()
          .split("\n")[1]
          .trim(),
        img_url:
          url +
          $(this)
            .find("img")
            .attr("src"),
        url:
          url +
          $(this)
            .find(".card-header-content")
            .find("a")
            .attr("href"),
        desc: $(this)
          .find("p")
          .text()
          .replace(/[\n\t]/g, "")
          .trim()
      };
    });
    return data;
  }
  async process() {
    let doctorList = await this.scrapMediciti();
    await CrawlUtils.uploadData({
      path: "/doctors",
      data: doctorList
    });
    return doctorList.length;
  }
}
const a = new Mediciti();
module.exports = new Mediciti();
a.process();
