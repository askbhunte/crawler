const axios = require("axios");
const cheerio = require("cheerio");
let baseUrl = "https://himalayanbank.com/branch";
class Himalayan {
  async branch() {
    let arr = [];
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    $("table table")
      .find("tr")
      .each(function(i, elem) {
        //   if (
        //     $(this)
        //       .find("h2")
        //       .text() &&
        //     !undefined
        //   )
        arr[i] = {
          name: $(this)
            .find("td:nth-child(2)")
            .text(),
          address: $(this)
            .find("td:nth-child(3)")
            .text(),
          contact: $(this)
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
    if (!data || !data.length) return processed;
    for (var i of data) {
      let payload = {};
      if (i) {
        payload.name = i.name || "";
        delete i.name;
        payload.address = i.address || i.loc;
        delete i.address;
        delete i.loc;
        payload.contact = i.contact || i.phone;
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
        payload.source = "everest";
        payload.extras = i;
        processed.push(payload);
      }
    }

    return processed;
  }
}
// const a = new Himalayan();
// a.process()
//   .then(console.log)
//   .catch(console.error);
module.exports = new Himalayan();
