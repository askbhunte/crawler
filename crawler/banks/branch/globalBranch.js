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
    url: "http://globalimebank.com/branchoutside",
    headers: { "Content-Type": "application/json" },
    httpsAgent: agent
  };
  axios(config)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      var branchList = [];

      $(".boxIn").each(function(i, elem) {
        branchList.push({
          name: $(this)
            .find("h1")
            .text(),
          details: $(this)
            .find("p")
            .text()
            .split("\n")
        });
      });
      branchList.push(response.data);
    })
    .catch(error => {
      console.log(error);
    });
}

let getManager = details => {
  if (details && details.length && details[0]) {
    let splited = details[0].split(":");
    if (splited.length > 0) {
      return splited[1];
    }
  }
  return "";
};

exports.process = async () => {
  let processed = [];
  let data = await makeGetRequest();
  if (!data || !data.length) return [];
  for (var i of data) {
    let payload = {};
    if (i) {
      payload.name = i.name || "";
      delete i.name;
      payload.address = i.address || i.loc;
      delete i.address;
      delete i.loc;
      payload.contact = i.contact;
      delete i.contact;
      payload.fax = i.fax;
      delete i.fax;
      payload.manager = i.manager || (await getManager(i.details));
      delete i.manager;
      if (i.details && i.details.length) delete i.details[0];
      payload.location = {
        type: "Point",
        coordinates: [parseFloat(i.lat || i.latitude), parseFloat(i.lng || i.longitude)]
      };
      delete i.latitude;
      delete i.longitude;
      delete i.lat;
      delete i.lng;
      payload.source = "everest";
      payload.extras = i;
      processed.push(payload);
    }
  }
  return processed;
};

// makeGetRequest()
//   .then(console.log)
//   .catch(console.error);
