const axios = require("axios");
const cheerio = require("cheerio");
let baseUrl = "https://www.sc.com/np/atms-and-branches.html";
class Standard {
  async branch() {
    let arr = [];
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    $("tr").each(function(i, elem) {
      let address = $(this)
        .find("td")
        .eq("0")
        .text()
        .split("\n")[2];
      address = String(address).trim();
      let phone = String(
        $(this)
          .find("td")
          .eq("0")
          .text()
          .split("\n")[4]
      ).replace(/([a-zA-Z :\t])/g, "");
      let manager = String(
        $(this)
          .find("td")
          .text()
          .split("Branch Manager:")[2]
      ).trim();
      arr[i] = {
        name: $(this)
          .find("td")
          .eq("0")
          .text()
          .split("\n")[0],
        address,
        phone,
        manager
      };
    });
    arr = arr.slice(22, 28);
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
        payload.source = "sc";
        payload.extras = i;
        processed.push(payload);
      }
    }

    return processed;
  }
}
// const a = new Standard();
// a.branch();
module.exports = new Standard();
