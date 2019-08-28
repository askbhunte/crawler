const axios = require("axios");
const cheerio = require("cheerio");
let baseUrl = "https://nepalsbi.com.np/content/our-branches.cfm";
const https = require("https");

const agent = new https.Agent({
  rejectUnauthorized: false
});

class SBI {
  async list() {
    let link = [];
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    $("li").each(function(i, elem) {
      link.push(
        $(this)
          .find("a")
          .attr("href")
      );
    });
    link = link.splice(28);
    return link;
  }
  async branch() {
    let arr = [];
    for (let i of await this.list()) {
      const config = {
        method: "get",
        url: i,
        headers: { "Content-Type": "application/json" },
        httpsAgent: agent
      };
      let { data } = await axios(config);
      const $ = cheerio.load(data);
      let name = $(".pretty")
        .find("b")
        .text();
      console.log(name);
      return;

      arr = arr.filter(el => {
        return el != null;
      });

      return arr;
    }
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
const a = new SBI();
a.branch();
// module.exports = new SBI();
