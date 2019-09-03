const axios = require("axios");
const cheerio = require("cheerio");
let baseUrl = "https://www.sanimabank.com/atm";
class Sanima {
  async branch() {
    let arr = [];
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    $(".branch-address-wrap").each(function(i, elem) {
      arr[i] = {
        name: $(this)
          .find("h4")
          .text(),
        loc: $(this)
          .find(".col-sm-2,col-xs-12")
          .eq("2")
          .find("p")
          .text(),
        district: $(this)
          .find(".col-sm-2,col-xs-12")
          .eq("0")
          .find("p")
          .text(),
        contact: $(this)
          .find(".col-sm-2,col-xs-12")
          .eq("3")
          .find("p")
          .text()
      };
    });

    return arr;
  }
  async process() {
    let processed = [];
    let data = await this.branch();
    if (!data || !data.length) return [];
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
// const a = new Sanima();
// a.process()
//   .then(console.log)
//   .catch(console.error);
module.exports = new Sanima();
