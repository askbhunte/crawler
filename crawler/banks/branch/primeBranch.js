const axios = require("axios");
const cheerio = require("cheerio");
let baseUrl = "https://www.primebank.com.np/branch/inside";
class Prime {
  async branch() {
    let arr = [];
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    $("tr")
      .find("td")
      .each(function(i, elem) {
        arr[i] = {
          name: $(this)
            .find(".itemTitle")
            .text(),
          manager: $(this)
            .find(".itemDesc")
            .find("b")
            .text(),
          address: $(this)
            .find(".itemDesc")
            .text()
            .split("Phone:")[0],
          phone: $(this)
            .find(".itemDesc")
            .text()
            .replace(/([a-zA-Z ])/g, "")
            .split(":")[1],
          fax: $(this)
            .find(".itemDesc")
            .text()
            .replace(/([a-zA-Z ])/g, "")
            .split(":")[2]
        };
      });
    arr = arr.filter(el => {
      return el.name !== "";
    });
    return arr;
  }
  async process() {
    let prime = await this.branch();
    await CrawlUtils.uploadData({
      path: "/prime",
      data: prime
    });
    return prime.length;
  }
}
module.exports = new Prime();
