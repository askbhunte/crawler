let axios = require("axios");
let cheerio = require("cheerio");
let fs = require("fs");
const https = require("https");

const agent = new https.Agent({
  rejectUnauthorized: false
});

async function makeGetRequest() {
  var atmList = [];

  const config = {
    method: "get",
    url: "http://globalimebank.com/atms",
    headers: { "Content-Type": "application/json" },
    httpsAgent: agent
  };
  let response = await axios(config);
  const html = response.data;
  const $ = cheerio.load(html);
  $(".tablescroll,contentholder")
    .find("font")
    .each(function(i, elem) {
      if (
        $(this)
          .text()
          .includes(".")
      ) {
        let doc = $(this)
          .text()
          .replace(/\n/g, " ")
          .trim();

        let docs = doc.split(/([0-9]+)/);
        for (var d of docs) {
          if (d.length > 6) {
            d = d.replace(".", "");
            atmList.push(d.trim());
          }
        }
        atmList.push(
          $(this)
            .text()
            .replace(/\n/g, " ")
            .trim()
        );
      }
    });
  atmList.push(response.data);
  return atmList;
}

exports.process = async () => {
  let processed = [];
  let data = await makeGetRequest();
  if (!data || data.length) return [];
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
