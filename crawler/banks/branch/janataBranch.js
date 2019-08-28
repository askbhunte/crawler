const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

const agent = new https.Agent({
  rejectUnauthorized: false
});
class Everest {
  async branch() {
    let arr = [];
    const config = {
      method: "get",
      url: "https://www.janatabank.com.np/contact-us/",
      headers: { "Content-Type": "application/json" },
      httpsAgent: agent
    };
    let { data } = await axios(config);
    const $ = cheerio.load(data);
    $(".branch-visible").each(function(i, elem) {
      arr[i] = {
        name: $(this)
          .find(".title")
          .text(),
        loc: $(this)
          .find(".cnt")
          .eq("0")
          .text(),
        phone: $(this)
          .find(".cnt")
          .eq("1")
          .text(),
        email: $(this)
          .find("a")
          .text()
      };
    });
    arr = arr.filter(el => {
      return el != null;
    });
    return arr;
  }
}
module.exports = new Everest();
