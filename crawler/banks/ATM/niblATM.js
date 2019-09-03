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
    let processed = [];
    let data = await this.ATM();
    for (var i of data) {
      let payload = {};
      payload.name = i.name || i;
      delete i.name;
      payload.address = i.address;
      delete i.address;
      if ((i.lat && i.lng) || (i.latitude || i.longitude)) {
        payload.location = {
          type: "Point",
          coordinates: [parseFloat(i.latitude || i.lat), parseFloat(i.longitude || i.lng)]
        };
        delete i.latitude, i.longitude, i.lat, i.lng;
      }
      payload.source = "nibl";
      payload.extras = i;
      processed.push(payload);
    }
    return processed;
  }
}

// let nib = new NIBL();
// nib
//   .process()
//   .then(console.log)
//   .catch(console.error);
module.exports = new NIBL();
