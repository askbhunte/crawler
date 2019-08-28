const axios = require("axios");
const cheerio = require("cheerio");
let baseUrl = "https://www.sanimabank.com/atm";
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
          .find(".col-sm-2,col-xs-12")
          .eq("2")
          .find("p")
          .text(),
        district: $(this)
          .find(".col-sm-2,col-xs-12")
          .eq("0")
          .find("p")
          .text(),
        contact: $(this)
          .find(".col-sm-2,col-xs-12")
          .eq("3")
          .find("p")
          .text()
      };
    });
    console.log(arr);
    arr = arr.filter(el => {
      return el != null;
    });
    return arr;
  }
  async process() {
    let atm = await this.branch();
    await CrawlUtils.uploadData({
      path: "/sanima",
      data: atm
    });
    return atm.length;
  }
}
const a = new Sanima();
a.branch();
// module.exports = new Sanima();
