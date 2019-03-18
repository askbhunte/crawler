const config = require("config");
const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");

let botUrl = config.get("services.nepalbot.url");
let url =
  "https://www.flightstats.com/go/weblet?guid=34b64945a69b9cac:-3e1fc49c:1367ec208ed:-2cb&weblet=status&action=AirportFlightStatus&airportCode=KTM&airportQueryType=1";

module.exports = async () => {
  let scraper = new ScraperClient({
    name: "FlightDeparture",
    repo: {
      url: botUrl + "/flight/feed"
    }
  });
  return scraper.process({
    target: { url },
    extractor: $ => {
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
      return { departureArr };
    }
  });
};
