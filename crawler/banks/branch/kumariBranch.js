const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

const agent = new https.Agent({
  rejectUnauthorized: false
});
class Kumari {
  async branch() {
    let arr = [];
    const config = {
      method: "get",
      url: "https://www.kumaribank.com/branch",
      headers: { "Content-Type": "application/json" },
      httpsAgent: agent
    };
    let { data } = await axios(config);
    const $ = cheerio.load(data);
    $(".col-md-4,col-xs-6")
      .find(".well")
      .each(function(i, elem) {
        let x = $(this)
          .find("p")
          .text()
          .split("\n")[3];
        let y = $(this)
          .find("p")
          .eq("1")
          .text()
          .split("\n")[2];
        // .replace(/[Phone:]+/g, "");

        //TODO

        arr[i] = {
          name: $(this)
            .find("h4")
            .text(),
          loc:
            $(this)
              .find("p")
              .html()
              .split("<br>")[0]
              .trim() ||
            $(this)
              .find("p")
              .eq("1")
              .html()
              .split("<br>")[0]
              .trim()
          // // phone:
        };
      });
    // console.log(arr);

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
        payload.source = "kumari";
        payload.extras = i;
        processed.push(payload);
      }
    }

    return processed;
  }
}
// const a = new Kumari();
// a.branch();
module.exports = new Kumari();
