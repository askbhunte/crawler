const axios = require("axios");
const cheerio = require("cheerio");
let baseUrl = "https://www.sanimabank.com/branches";
class Sanima {
  async branch() {
    let arr = [];
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    $(".branch-address-wrap").each(function(i, elem) {
      arr[i] = {
        name: $(this)
          .find("h4")
          .text(),
        loc: $(this)
          .find("p")
          .eq("1")
          .text()
          .trim(),
        manager: $(this)
          .find(".col-sm-3,col-xs-12")
          .find("p")
          .eq("0")
          .text()
          .trim(),
        phone: $(this)
          .find(".col-sm-4,col-xs-12")
          .eq("1")
          .find("p")
          .text(),
        email: $(this)
          .find(".col-sm-3,col-xs-12")
          .find("p")
          .eq("1")
          .text()
          .trim()
      };
    });
    arr = arr.filter(el => {
      return el != null;
    });
    return arr;
  }
  async process() {
    let branch = await this.branch();
    await CrawlUtils.uploadData({
      path: "/sanima",
      data: branch
    });
    return branch.length;
  }
}
module.exports = new Sanima();
