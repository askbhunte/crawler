let axios = require("axios");
let cheerio = require("cheerio");
const CrawlUtils = require("../utils");

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
          img_url:
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
    return { beds, website, list };
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
            .text(),
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
  async mapDocToHospital() {
    let elem = [];
    let arr = await this.getData();
    for (let i of arr) {
      let { beds, website, list } = await this.getDoc(i.link);
      i.beds = beds;
      i.website = website;
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
module.exports = new Doctor();
