const axios = require("axios");
const cheerio = require("cheerio");
let baseUrl = "http://nccbank.com.np/atm-location.html";
class NCC {
  async branch() {
    let arr = [];
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    $("table")
      .find("td")
      .each(function(i, elem) {
        arr[i] = {
          name: $(this)
            .text()
            .split(/\n\t\t\t/g)

          //   name: $(this)
          //     .find(".media-heading")
          //     .text(),
          //   loc: $(this)
          //     .find(".media-body")
          //     .text()
          //     .split("\n")[2]
          //     .replace(/^\s+|\s+$/g, ""),
          //   phone: $(this)
          //     .find(".media-body")
          //     .text()
          //     .split("\n")[3]
          //     .replace(/^\s+|\s+$/g, ""),
          //   fax: $(this)
          //     .find(".media-body")
          //     .text()
          //     .split("\n")[4]
          //     .replace(/^\s+|\s+$/g, "")
        };
      });
    arr = arr.filter(el => {
      return el != null;
    });
    console.log(arr);
    return arr;
  }
  async process() {
    let mega = await this.branch();
    await CrawlUtils.uploadData({
      path: "/mega",
      data: mega
    });
    return mega.length;
  }
}
const a = new NCC();
a.branch();
// module.exports = new Mega();
