const axios = require("axios");
const cheerio = require("cheerio");
const BullionModel = require("./bullion.model");
const { templates, sendMail } = require("../../utils/messenger");

let date;
class Bullion {
  constructor() {}
  async create() {
    let bullions = await axios.get("https://www.sharesansar.com/bullion").then(response => {
      var bullionArr;
      if (response.status === 200) {
        const html = response.data;
        const $ = cheerio.load(html);
        bullionArr = [];

        $("tr").each(function(i, elem) {
          bullionArr[i] = {
            title: $(this)
              .find("h3")
              .find("u")
              .text()
              .trim(),
            rate: $(this)
              .find("h4")
              .find("p")
              .text()
              .trim()
          };
        });
        date = $("p")
          .find(".text-org")
          .text();
        bullionArr.forEach(element => {
          if (element.title.toLowerCase().includes("gold")) {
            element.image_url = "http://all4desktop.com/data_images/original/4241648-gold.jpg";
          }
          if (element.title.toLowerCase().includes("silver")) {
            element.image_url = "https://www.outlawz.ch/resources/Silversilberbarren.jpg";
          }
          element.date = date;
        });
        // let trimmerData = newsArr.filter(n => n != undefined);
        // fs.writeFile("bulllion.json", JSON.stringify(trimmerData, null, 4), err => {
        //   console.log("File successfully written!");
        // });
      }
      return bullionArr;
    });
    let test = await BullionModel.deleteMany({
      $where: `this.date.toJSON().slice(0, 10)=="${date}"`
    });
    try {
      return BullionModel.insertMany(bullions);
    } catch (e) {
      sendMail({
        to: "bibek.gaihre@rumsan.com",
        template: templates.shareEvent
      });
      console.log(e);
    }
    // return bullions;
  }
}

module.exports = new Bullion();
