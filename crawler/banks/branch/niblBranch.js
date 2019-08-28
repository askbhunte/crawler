const axios = require("axios");
const cheerio = require("cheerio");
let baseUrl =
  "https://www.nibl.com.np/index.php?option=com_content&view=article&id=70&Itemid=76";
class NIBL {
  async branch() {
    let arr = [];
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    $("table:nth-child(4)")
      .find("table:nth-child(7)")
      .find("tr")
      .each(function(i, elem) {
        arr[i] = {
          details: $(this)
            .text()
            .split("br")
        };
      });
    console.log(arr);
    return arr;
  }
  async process() {
    let niblAtm = await this.branch();
    await CrawlUtils.uploadData({
      path: "/nibl",
      data: niblAtm
    });
    return niblAtm.length;
  }
}
const a = new NIBL();
a.branch();
// module.exports = new SBI();
