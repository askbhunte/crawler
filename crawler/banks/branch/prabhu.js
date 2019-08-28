const axios = require("axios");
const cheerio = require("cheerio");
let baseUrl = "https://www.prabhubank.com/page/branch-network.html";
class Prabhu {
  async branch() {
    let arr = [];
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    $("table table")
      .find("tr")
      .each(function(i, elem) {
        arr[i] = {
          name: $(this)
            .find("td:nth-child(2)")
            .text(),
          loc: $(this)
            .find("td:nth-child(3)")
            .text(),
          phone: $(this)
            .find("td:nth-child(4)")
            .text(),
          fax: $(this)
            .find("td:nth-child(5)")
            .text(),
          cntct_prsn: $(this)
            .find("td:nth-child(6)")
            .text()
        };
      });
    console.log(arr);
    arr = arr.filter(el => {
      return el != null;
    });
    return arr;
  }
  //   async process() {
  //     let grandeDoc = await this.grandeDoc();
  //     console.log(grandeDoc);
  //     await CrawlUtils.uploadData({
  //       path: "/nmb",
  //       data: grandeDoc
  //     });
  //     return grandeDoc.length;
  //   }
}
const a = new Prabhu();
a.branch();
// module.exports = new Grande();
