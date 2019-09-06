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
          manager: $(this)
            .find("td:nth-child(6)")
            .text()
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
        payload.name = i.name || i;
        delete i.name;
        payload.address = i.address || i.loc.toString();
        delete i.address;
        delete i.loc;
        if ((i.lat && i.lng) || (i.latitude || i.longitude)) {
          payload.location = {
            type: "Point",
            coordinates: [parseFloat(i.latitude || i.lat), parseFloat(i.longitude || i.lng)]
          };
          delete i.latitude;
          delete i.longitude;
          delete i.lat;
          delete i.lng;
        }
        payload.source = "prabhu";
        payload.extras = i;
        processed.push(payload);
      }
    }
    return processed;
  }
}
const a = new Prabhu();
// a.process()
//   .then(console.log)
//   .catch(console.error);
module.exports = new Prabhu();
