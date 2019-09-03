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
    return arr;
  }

  async process() {
    let processed = [];
    let data = await this.branch();
    for (var i of data) {
      if (i) {
        let payload = {};
        payload.name = i.name;
        delete i.name;
        payload.address = i.loc || "";
        delete i.loc;
        payload.location = {
          type: "Point",
          coordinates: [parseFloat(i.lat), parseFloat(i.lng)]
        };
        delete i.lat, i.lng;
        payload.source = "kumari";
        payload.extras = i;
        processed.push(payload);
      }
    }
    return processed;
  }
}
module.exports = new Kumari();
// let kumari = new Kumari();
// kumari
//   .process()
//   .then(console.log)
//   .catch(console.error);
