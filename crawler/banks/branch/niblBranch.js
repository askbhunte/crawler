const axios = require("axios");
const cheerio = require("cheerio");
let baseUrl = "https://www.nibl.com.np/index.php?option=com_content&view=article&id=70&Itemid=76";
class NIBL {
  async branch() {
    let arr = [];
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    $("table:nth-child(4)")
      .find("table:nth-child(7)")
      .find("tr")
      .each(function(i, elem) {
        arr[i] = {
          details: $(this)
            .text()
            .split("br")
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
        payload.source = "nibl";
        payload.extras = i;
        processed.push(payload);
      }
    }

    return processed;
  }
}
// const a = new NIBL();
// a.branch();
module.exports = new NIBL();
