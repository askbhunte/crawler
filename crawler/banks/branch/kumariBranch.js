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
      url: "https://www.kumaribank.com/branch",
      headers: { "Content-Type": "application/json" },
      httpsAgent: agent
    };
    let { data } = await axios(config);
    const $ = cheerio.load(data);
    $(".col-md-4,col-xs-6")
      .find(".well")
      .each(function(i, elem) {
        let x = $(this)
          .find("p")
          .text()
          .split("\n")[3];
        let y = $(this)
          .find("p")
          .eq("1")
          .text()
          .split("\n")[2];
        // .replace(/[Phone:]+/g, "");

        //TODO
        console.log(x, "----");
        console.log(y, "---=====");
        arr[i] = {
          name: $(this)
            .find("h4")
            .text(),
          loc:
            $(this)
              .find("p")
              .html()
              .split("<br>")[0]
              .trim() ||
            $(this)
              .find("p")
              .eq("1")
              .html()
              .split("<br>")[0]
              .trim()
          // // phone:
        };
      });
    // console.log(arr);
    arr = arr.filter(el => {
      return el != null;
    });
    return arr;
  }
}
const a = new Kumari();
a.branch();
// module.exports = new Kumari();
