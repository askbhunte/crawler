const config = require("config");
const { templates, sendMail } = require("../../utils/messenger");
const ScraperClient = require("../../utils/scraper");

let botUrl = config.get("services.nepalbot.url");
let url =
  "https://www.flightstats.com/go/weblet?guid=34b64945a69b9cac:-3e1fc49c:1367ec208ed:-2cb&weblet=status&action=AirportFlightStatus&airportCode=KTM&airportQueryType=1";

module.exports = async () => {
  let scraper = new ScraperClient({
    name: "Dep",
    repo: {
      url: botUrl + "/flight/feed"
    }
  });
  return scraper.process({
    target: { url },
    extractor: $ => {
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
      var filtered = arrivalArr.filter(function(el) {
        return el != null;
      });
      var arrivaldata = filtered.map(elem => {
        return {
          plane_code: elem.plane_code.replace(/\s/g, ""),
          origin: elem.origin,
          url: elem.link,
          flight_status: elem.flight_status,
          arrival_time: elem.arrival,
          departure_time: null,
          destination: "(KTM) Kathmandu"
        };
      });
      return arrivaldata;
    }
  });
};
