const axios = require("axios");
const cheerio = require("cheerio");
let baseUrl = "https://www.sanimabank.com/branches";
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
          .find("p")
          .eq("1")
          .text()
          .trim(),
        manager: $(this)
          .find(".col-sm-3,col-xs-12")
          .find("p")
          .eq("0")
          .text()
          .trim(),
        phone: $(this)
          .find(".col-sm-4,col-xs-12")
          .eq("1")
          .find("p")
          .text(),
        email: $(this)
          .find(".col-sm-3,col-xs-12")
          .find("p")
          .eq("1")
          .text()
          .trim()
      };
    });

    return arr;
  }

  getManager(details) {
    if (details && details.length && details[0]) {
      let splited = details[0].split(":");
      if (splited.length > 0) {
        return splited[1];
      }
    }
    return "";
  }
  async process() {
    let processed = [];
    let data = await this.branch();
    if (!data || !data.length) return [];
    for (var i of data) {
      let payload = {};
      if (i) {
        payload.name = i.name || "";
        delete i.name;
        payload.address = i.address || i.loc;
        delete i.address;
        delete i.loc;
        payload.contact = i.contact || i.phone || i.email;
        delete i.contact;
        payload.fax = i.fax;
        delete i.fax;
        payload.manager = i.manager || (await this.getManager(i.details));
        delete i.manager;
        if (i.details && i.details.length) delete i.details[0];
        payload.location = {
          type: "Point",
          coordinates: [parseFloat(i.lat || i.latitude), parseFloat(i.lng || i.longitude)]
        };
        delete i.latitude;
        delete i.longitude;
        delete i.lat;
        delete i.lng;
        payload.source = "sanima";
        payload.extras = i;
        processed.push(payload);
      }
    }

    return processed;
  }
}

module.exports = new Sanima();
