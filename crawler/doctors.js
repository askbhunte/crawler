let axios = require("axios");
let cheerio = require("cheerio");
let fs = require("fs");
const https = require("https");
let url = "https://www.hamrodoctor.com";
let cat_url = url + "/doctors/";
const agent = new https.Agent({
  rejectUnauthorized: false
});
class Doctor {
  async getCategory() {
    let response = await axios(cat_url);
    const html = response.data;
    const $ = cheerio.load(html);
    let data = [];
    $(".tg-subcategorycheckbox").each(function(i, elem) {
      data[i] = {
        link: $(this).attr("href")
      };
    });

    return data;
  }
  async getData() {
    let categoryList = await this.getCategory();
    var list = [];

    for (let i of categoryList) {
      const config = {
        method: "get",
        url: url + i.link,
        headers: { "Content-Type": "application/json" },
        httpsAgent: agent
      };

      let response = await axios(config);

      const html = response.data;
      const $ = cheerio.load(html);

      let speciality = $(".tg-pagehead")
        .find("h3")
        .html()
        .split("<small>");
      let specs = speciality[0]
        .replace("Top Doctors in Nepal providing ", "")
        .replace("service", "")
        .trim();
      $(".tg-directpost").each(function(i, elem) {
        let exp = $(elem)
          .children(".tg-directinfo")
          .find(".tg-contactinfo")
          .children("li");
        let age = $(exp[1])
          .text()
          .trim();
        list.push({
          title: $(elem)
            .children(".tg-directinfo")
            .find(".tg-directposthead")
            .find("h3")
            .text()
            .trim(),
          field: $(elem)
            .children(".tg-directinfo")
            .find(".tg-directposthead")
            .find(".tg-subjects")
            .text()
            .trim(),
          degree: $(elem)
            .children(".tg-directinfo")
            .find(".tg-contactinfo")
            .find(".tg-subjects")
            .text()
            .trim(),
          experience: age,
          specialty: specs
        });
      });
    }
    fs.writeFileSync("hamrodoctor_doctors.json", JSON.stringify(list, null, 4));
    console.log("File successfully written!");
  }
}

module.exports = new Doctor();
