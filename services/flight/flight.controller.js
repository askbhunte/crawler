const axios = require("axios");
const cheerio = require("cheerio");

const FlightModel = require("./flight.model");

const { templates, sendMail } = require("../../utils/messenger");

class Flight {
  constructor() {}

  async create() {
    let arrival = await axios
      .get(
        "https://www.flightstats.com/go/weblet?guid=34b64945a69b9cac:-3e1fc49c:1367ec208ed:-2cb&weblet=status&action=AirportFlightStatus&airportCode=KTM&airportQueryType=1"
      )
      .then(
        response => {
          // console.log(response.data);
          if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            var arrivalArr = [];
            $("table")
              .find("tr:not(:first-child)")
              .each(function(i, elem) {
                if (
                  $(this)
                    .find("td:first-child")
                    .find("a")
                    .text() !== ""
                )
                  arrivalArr[i] = {
                    plane_code: $(this)
                      .find("td:first-child")
                      .find("a")
                      .text()
                      .trim(),
                    link: $(this)
                      .find("td:first-child")
                      .find("a")
                      .attr("href"),
                    flight_status: $(this)
                      .find("td:last-child")
                      .text()
                      .replace(/[\n]| +/g, "")
                      .trim(),
                    arrival: $(this)
                      .find("td")
                      .eq(-2)
                      .text()
                      .trim(),
                    origin: $(this)
                      .find("td")
                      .eq(2)
                      .text()
                      .trim()
                  };
              });
          }
          return arrivalArr;
        },
        error => console.log(error)
      );
    let departure = await axios
      .get(
        "https://www.flightstats.com/go/weblet?guid=34b64945a69b9cac:-3e1fc49c:1367ec208ed:-2cb&weblet=status&action=AirportFlightStatus&airportCode=KTM&airportQueryType=1"
      )
      .then(
        response => {
          if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            var departureArr = [];
            $("table")
              .find("tr:not(:first-child)")
              .each(function(i, elem) {
                if (
                  $(this)
                    .find("td:first-child")
                    .find("a")
                    .text() !== ""
                )
                  departureArr[i] = {
                    plane_code: $(this)
                      .find("td:first-child")
                      .find("a")
                      .text()
                      .trim(),
                    link: $(this)
                      .find("td:first-child")
                      .find("a")
                      .attr("href"),
                    flight_status: $(this)
                      .find("td:last-child")
                      .text()
                      .replace(/[\n]| +/g, "")
                      .trim(),
                    departure: $(this)
                      .find("td")
                      .eq(-2)
                      .text()
                      .trim(),
                    destination: $(this)
                      .find("td")
                      .eq(2)
                      .text()
                      .trim()
                  };
              });
          }
          return departureArr;
        },
        error => {
          sendMail({
            to: "bibek.gaihre@rumsan.com",
            template: templates.shareEvent
          });
          console.log(error);
        }
      );
    let data = [...arrival, ...departure];
    let trimmerData = data.filter(n => n != undefined);

    console.log(trimmerData);
    return FlightModel.insertMany(trimmerData);
  }
}

module.exports = new Flight();
