let axios = require("axios");
let cheerio = require("cheerio");
let fs = require("fs");
const https = require("https");

const agent = new https.Agent({
  rejectUnauthorized: false
});

async function makeGetRequest() {
  const config = {
    method: "get",
    url: "https://www.primebank.com.np/service/atm",
    headers: { "Content-Type": "application/json" },
    httpsAgent: agent
  };
  axios(config)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      var atmList = [];

      $("table:nth-child(3)")
        .find("tr")
        .each(function(i, elem) {
          atmList.push(
            $(this)
              .find("td")
              .find("strong")
              .text()
              .trim()
          );
        });

      return atmList;
    })
    .catch(error => {
      console.log(error);
    });
}

exports.process = async () => {
  let processed = [];
  let data = await makeGetRequest();
  if (!data || !data.length) return [];
  for (var i of data) {
    if (i) {
      let payload = {};
      payload.name = i.name || i;
      delete i.name;
      payload.address = i.address || i.loc.toString();
      delete i.address;
      delete i.loc;
      if ((i.lat && i.lng) || (i.latitude || i.longitude)) {
        payload.location = {
          type: "Point",
          coordinates: [parseFloat(i.latitude || i.lat), parseFloat(i.longitude || i.lng)]
        };
        delete i.latitude;
        delete i.longitude;
        delete i.lat;
        delete i.lng;
      }
      payload.source = "prabhu";
      payload.extras = i;
      processed.push(payload);
    }
  }
  return processed;
};

// process()
//   .then(console.log)
//   .catch(console.error);
