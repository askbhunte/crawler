const axios = require("axios");
const cheerio = require("cheerio");
let baseUrl =
  "https://www.nibl.com.np/index.php?option=com_content&view=article&id=4&Itemid=12&limitstart=1";

class NIBL {
  async ATM() {
    let link = [];
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    $(".contentpaneopen")
      .find("ul")
      .find("li")
      .each(function(i, elem) {
        link.push($(this).text());
      });
    return link;
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
module.exports = new NIBL();
