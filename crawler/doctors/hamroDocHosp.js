let axios = require("axios");
let cheerio = require("cheerio");
const fs = require("fs");
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
    $(".col-md-9")
      .find(".tg-directposthead")
      .each(function(i, elem) {
        list[i] = {
          name: $(this)
            .find("h3")
            .text()
            .replace("\t", ""),
          link:
            baseUrl +
            $(this)
              .find("a")
              .attr("href"),
          desc: $(this)
            .find(".tg-subjects")
            .text()
            .trim(),
          img_url:
            baseUrl +
            $(this)
              .find("figure")
              .find("img")
              .attr("src")
        };
      });
    console.log(list);
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
    let elem = [];
    var arr = [];
    let pagination = await this.getPage();
    for (let i = 1; i <= pagination; i++) {
      let response = await axios(url + i);
      const html = response.data;
      const $ = cheerio.load(html);
      $(".tg-directpost").each(function(i, elem) {
        arr[i] = {
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
        };
      });

      for (let i of arr) {
        let { beds, website, list } = await this.getDoc(i.link);
        console.log(beds, website);
        i.beds = beds;
        i.website = website;
        i.doc = list;
        elem.push(i);
      }
    }
    fs.writeFileSync("docs.json", JSON.stringify(elem, null, 4));
    console.log("File successfully written!");
    return elem;
  }
}
const a = new Doctor();
a.getData();
// module.exports = new Doctor();
