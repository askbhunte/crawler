const axios = require("axios");
const cheerio = require("cheerio");
let baseUrl = "https://www.primebank.com.np/branch/inside";
class Prime {
  async branch() {
    let arr = [];
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    $("tr")
      .find("td")
      .each(function(i, elem) {
        arr[i] = {
          name: $(this)
            .find(".itemTitle")
            .text(),
          manager: $(this)
            .find(".itemDesc")
            .find("b")
            .text(),
          address: $(this)
            .find(".itemDesc")
            .text()
            .split("Phone:")[0],
          phone: $(this)
            .find(".itemDesc")
            .text()
            .replace(/([a-zA-Z ])/g, "")
            .split(":")[1],
          fax: $(this)
            .find(".itemDesc")
            .text()
            .replace(/([a-zA-Z ])/g, "")
            .split(":")[2]
        };
      });
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
        payload.source = "prime";
        payload.extras = i;
        processed.push(payload);
      }
    }

    return processed;
  }
}

// let prime = new Prime();
// prime
//   .process()
//   .then(console.log)
//   .catch(console.error);
module.exports = new Prime();
