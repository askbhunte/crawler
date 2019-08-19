const axios = require("axios");
const cheerio = require("cheerio");
const CrawlUtils = require("../utils");
const NodeGeocoder = require("node-geocoder");
var options = {
  provider: "google",

  httpAdapter: "https",
  apiKey: "AIzaSyDC51QC1eaas70Slrlu3-uNxAXA2tTtZBQ",
  formatter: null
};
var geocoder = NodeGeocoder(options);

let url = "https://www.hamrodoctor.com/hospitals/index/page:";
let baseUrl = "https://www.hamrodoctor.com";
class Doctor {
  async getDoc(link) {
    let list = [];
    let response = await axios(link);
    const html = response.data;
    const $ = cheerio.load(html);
    let website = $(".doctor-details")
      .find("li")
      .eq("5")
      .text()
      .replace("Website -", "");
    let beds = $(".doctor-details")
      .find("li")
      .eq("0")
      .text()
      .split("|");
    let hosp_img =
      baseUrl +
      $(
        "#tg-content > div.col-lg-9.col-md-8.col-sm-8.col-xs-12.pull-right > div:nth-child(1) > img"
      ).attr("src");
    beds = beds.map(el => {
      if (/\d /.test(el)) {
        return el.trim().replace("Beds in ", "");
      }
    });
    $(".col-md-6,col-doctor-list").each(function(i, elem) {
      if (
        $(this)
          .find(".col-md-9")
          .find(".tg-directposthead")
          .find("h3")
          .text()
      )
        list[i] = {
          name: $(this)
            .find(".col-md-9")
            .find(".tg-directposthead")
            .find("h3")
            .text()
            .replace("\t", ""),
          link:
            baseUrl +
            $(this)
              .find(".col-md-9")
              .find(".tg-directposthead")
              .find("a")
              .attr("href"),
          desc: $(this)
            .find(".col-md-9")
            .find(".tg-directposthead")
            .find(".tg-subjects")
            .text()
            .trim(),
          doc_img:
            typeof $(
              `#doctors > div > div > div:nth-child(${i + 1}) > div.col-md-3 > figure > img`
            ).attr("data-original") === "string"
              ? baseUrl +
                $(
                  `#doctors > div > div > div:nth-child(${i + 1}) > div.col-md-3 > figure > img`
                ).attr("data-original")
              : baseUrl + "/img/def_dr_Male.png"
        };
    });
    return { beds, website, list, hosp_img };
  }
  async getPage() {
    let response = await axios(url);
    const html = response.data;
    const $ = cheerio.load(html);
    let totalDocs = Number(
      $(".tg-pagehead")
        .find("h3 > small")
        .text()
        .replace(/\D/g, "")
    );
    let page = Math.ceil(totalDocs / $(".tg-directpost").length);
    return parseInt(page);
  }
  async getData() {
    var arr = [];
    let pagination = await this.getPage();
    for (let i = 1; i <= pagination; i++) {
      let response = await axios(url + i);
      const html = response.data;
      const $ = cheerio.load(html);
      $(".tg-directpost").each(function(i, elem) {
        arr.push({
          name: $(this)
            .find("h3")
            .text(),
          link:
            baseUrl +
            $(this)
              .find(".tg-directposthead")
              .find("a")
              .attr("href"),
          address: $(this)
            .find("address")
            .text(),
          contact: $(this)
            .find("span")
            .text()
            .replace(/[a-zA-Z]/g, ""),
          logo:
            baseUrl +
            $(this)
              .find("img")
              .attr("src")
        });
      });
    }
    return arr;
  }
  async getGeoLoc(payload) {
    let data = await geocoder.geocode(`${payload} nepal`);
    let location = {};
    if (data && data.length && data[0].latitude) {
      location = {
        type: "Point",
        coordinates: [data[0].latitude, data[0].longitude]
      };
    }
    return location;
  }
  async mapDocToHospital() {
    let elem = [];
    let arr = await this.getData();
    for (var i of arr) {
      i.location = await this.getGeoLoc(i.name);
      let { beds, website, list, hosp_img } = await this.getDoc(i.link);
      i.beds = beds;
      i.hosp_img = hosp_img;
      i.website = website;
      i.source = "hamrodoctor";
      i.doc = list;
      elem.push(i);
    }
    return elem;
  }
  async process() {
    let hospitalList = await this.mapDocToHospital();
    await CrawlUtils.uploadData({
      path: "/hospital",
      data: hospitalList
    });
    return hospitalList.length;
  }
}
const a = new Doctor();
a.process()
  .then(console.log)
  .catch(console.error);
// module.exports = new Doctor();
