const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

const agent = new https.Agent({
  rejectUnauthorized: false
});
class Kumari {
  async branch() {
    let arr = [];
    const config = {
      method: "get",
      url: "https://www.kumaribank.com/atm.html",
      headers: { "Content-Type": "application/json" },
      httpsAgent: agent
    };
    let { data } = await axios(config);
    const $ = cheerio.load(data);
    $(".atm-locations")
      .find(".well")
      .each(function(i, elem) {
        arr[i] = {
          name: $(this)
            .find("h4")
            .text(),
          loc:
            $(this)
              .find("p")
              .eq("0")
              .text()
              .replace(/\n|\t/g, "")
              .trim() ||
            $(this)
              .find("p")
              .eq("1")
              .text()
              .replace(/\n|\t/g, "")
              .trim()
          // phone: $(this)
          //   .find(".cnt")
          //   .eq("1")
          //   .text(),
          // email: $(this)
          //   .find("a")
          //   .text()
        };
      });
    arr = arr.filter(el => {
      return el != null;
    });
    return arr;
  }
}
module.exports = new Kumari();
