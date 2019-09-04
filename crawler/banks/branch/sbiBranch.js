const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");
let agent = new https.Agent({
  rejectUnauthorized: false
});
class SBI {
  async list() {
    let link = [];
    const config = {
      method: "get",
      url: "https://nepalsbi.com.np/content/our-branches.cfm",
      headers: { "Content-Type": "application/json" },
      httpsAgent: agent
    };
    let { data } = await axios(config);
    const $ = cheerio.load(data);
    $("li").each(function(i, elem) {
      link.push(
        $(this)
          .find("a")
          .attr("href")
      );
    });
    link = link.splice(28);
    return link;
  }
  async branch() {
    let arr = [];
    let link = await this.list();
    for (let i of link) {
      if (!i.includes("https")) {
        var x = i.split("http");
        var y = "https";
        var z = y.concat(x[1]);
        i = z;
      }
      const config = {
        method: "get",
        url: i,
        headers: { "Content-Type": "application/json" },
        httpsAgent: agent
      };
      let { data } = await axios(config);
      const $ = cheerio.load(data);
      let obj = {
        name: $(".leftblock")
          .find("h4")
          .text(),
        address: $(".pretty")
          .eq("0")
          .html()
          .split("<br>\n")[1],
        phone: $(".pretty")
          .eq("0")
          .html()
          .split("<br>\n")[2],
        fax: $(".pretty")
          .eq("0")
          .html()
          .split("<br>\n")[3],
        swift: $(".pretty")
          .eq("0")
          .html()
          .split("<br>\n")[4],
        email: $(".pretty")
          .eq("0")
          .html()
          .split("<br>\n")[5]
      };
      arr.push(obj);
    }
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

  getFax(fax) {
    if (fax) {
      let splited = fax.split(":");
      if (splited.length && splited[1]) {
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
        payload.fax = await this.getFax(i.fax);
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
        payload.source = "sbi";
        payload.extras = i;
        processed.push(payload);
      }
    }
    return processed;
  }
}
// const a = new SBI();
// a.branch();
module.exports = new SBI();
