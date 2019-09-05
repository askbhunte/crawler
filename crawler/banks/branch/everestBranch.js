const axios = require("axios");
const cheerio = require("cheerio");
let baseUrl = "https://www.everestbankltd.com/about/branches/";
class EverestBranch {
  async district() {
    let districts = [];
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    $("select")
      .find("option")
      .each(function() {
        if ($(this).val()) districts.push($(this).val());
      });
    return districts;
  }
  async branch() {
    let arr = [];
    let branches = [];
    for (let i of await this.district()) {
      let url = baseUrl + "?dis=" + i;
      let { data } = await axios.get(url);
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
              details: $(this)
                .find(".location-child-list")
                .find("li")
                .eq("0")
                .text()
                .replace(/\n|\t/g, "")
                //todo - details
                .split(","),
              lat: $(this)
                .find(".pointer,marker--locate")
                .attr("data-lat"),
              lng: $(this)
                .find(".pointer,marker--locate")
                .attr("data-lng")
            };
        });
      branches.push(...arr);
    }
    return branches;
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
        payload.contact = i.contact;
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
// const a = new EverestBranch();
// a.process()
//   .then(console.log)
//   .catch(console.error);
module.exports = new EverestBranch();
