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
      fs.writeFileSync(
        "../data/century_bank_atm.json",
        JSON.stringify(branchList, null, 4)
      );
      console.log("File successfully written!");
    })
    .catch(error => {
      console.log(error);
    });
}

makeGetRequest();
