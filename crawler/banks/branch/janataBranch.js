const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

const agent = new https.Agent({
  rejectUnauthorized: false
});
class Janata {
  async branch() {
    let arr = [];
    const config = {
      method: "get",
      url: "https://www.janatabank.com.np/contact-us/",
      headers: { "Content-Type": "application/json" },
      httpsAgent: agent
    };
    let { data } = await axios(config);
    const $ = cheerio.load(data);
    $(".branch-visible").each(function(i, elem) {
      arr[i] = {
        name: $(this)
          .find(".title")
          .text(),
        loc: $(this)
          .find(".cnt")
          .eq("0")
          .text(),
        phone: $(this)
          .find(".cnt")
          .eq("1")
          .text(),
        email: $(this)
          .find("a")
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
        payload.source = "janata";
        payload.extras = i;
        processed.push(payload);
      }
    }

    return processed;
  }
}
module.exports = new Janata();
