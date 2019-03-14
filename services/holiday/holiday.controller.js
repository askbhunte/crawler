const axios = require("axios");
const cheerio = require("cheerio");
const { templates, sendMail } = require("../../utils/messenger");

let date = new Date();
let year = date.getFullYear();
let url = `https://publicholidays.asia/nepal/${year}-dates/#`;
let trimmerData;

const HolidayModel = require("./holiday.model");

class Holiday {
  constructor() {}
  async create() {
    let holidays = await axios.get(url).then(
      response => {
        if (response.status === 200) {
          const html = response.data;
          const $ = cheerio.load(html);
          var holidayArr = [];
          $("table")
            .find("tr")
            .each(function(i, elem) {
              if (
                $(this)
                  .find("td")
                  .eq(2)
                  .text() !== ""
              )
                holidayArr[i] = {
                  holiday_date: $(this)
                    .find("td:first-child")
                    .text()
                    .trim(),
                  holiday_day: $(this)
                    .find("td")
                    .eq(1)
                    .text()
                    .trim(),
                  holiday_desc: $(this)
                    .find("td")
                    .eq(2)
                    .text()
                    .trim()
                };
            });

          trimmerData = holidayArr.filter(n => n != undefined);
        }
        return trimmerData;
      },
      error => {
        sendMail({
          to: "dipesh.lohani@rumsan.com",
          template: templates.shareEvent
        });
        console.log(error);
      }
    );
    return HolidayModel.insertMany(holidays);
  }
}

module.exports = new Holiday();
