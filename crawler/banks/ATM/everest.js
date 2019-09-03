const axios = require("axios");
const cheerio = require("cheerio");
let baseUrl = "https://www.everestbankltd.com/product-and-services/card-services/atm-location/";
class Everest {
  async branch() {
    let arr = [];
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    $(".locationScroll")
      .find("ul")
      .find("li")
      .each(function(i, elem) {
        if (
          $(this)
            .find(".location-title")
            .text()
        )
          arr[i] = {
            name: $(this)
              .find(".location-title")
              .text()
              .replace(/\n|\t/g, ""),
            loc: $(this)
              .find(".location-child-list")
              .find("li")
              .text()
              .replace(/\n|\t/g, "")
              .split("District:"),
            lat: $(this)
              .find(".pointer,marker--locate")
              .attr("data-lat"),
            lng: $(this)
              .find(".pointer,marker--locate")
              .attr("data-lng")
            // phone: $(this)
            //   .find("td:nth-child(4)")
            //   .text(),
            // fax: $(this)
            //   .find("td:nth-child(5)")
            //   .text(),
            // cntct_prsn: $(this)
            //   .find("td:nth-child(6)")
            //   .text()
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
        payload.address = i.loc.toString();
        delete i.loc;
        payload.location = {
          type: "Point",
          coordinates: [parseFloat(i.lat), parseFloat(i.lng)]
        };
        delete i.lat;
        delete i.lng;
        payload.source = "everest";
        payload.extras = i;
        processed.push(payload);
      }
    }
    return processed;
  }
}
// const a = new Everest();
// a.process()
//   .then(console.log)
//   .catch(console.error);
module.exports = new Everest();
