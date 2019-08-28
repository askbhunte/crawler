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
      atmList = atmList.filter(el => {
        return el !== "";
      });
      return atmList;
    })
    .catch(error => {
      console.log(error);
    });
}

makeGetRequest();
