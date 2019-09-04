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

    return arr;
  }
  async process() {
    let processed = [];
    let data = await this.branch();
    for (var i of data) {
      if (i) {
        let payload = {};
        payload.name = i.name.toString();
        delete i.name;
        payload.address = i.loc || "";
        delete i.loc;
        payload.location = {
          type: "Point",
          coordinates: [parseFloat(i.lat), parseFloat(i.lng)]
        };
        delete i.lat;
        delete i.lng;
        payload.source = "kumari";
        payload.extras = i;
        processed.push(payload);
      }
    }
    return processed;
  }
}
// const a = new NCC();
// a.process()
//   .then(console.log)
//   .catch(console.error);
module.exports = new NCC();
