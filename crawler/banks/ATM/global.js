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
    url: "http://globalimebank.com/atms",
    headers: { "Content-Type": "application/json" },
    httpsAgent: agent
  };
  axios(config)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      var atmList = [];
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

            // let docs = doc.split(/([0-9]+)/);
            // for (var d of docs) {
            //   if (d.length > 6) {
            //     d = d.replace(".", "");
            //     atmList.push(d.trim());
            //   }
            // }
            // atmList.push(
            //   $(this)
            //     .text()
            //     .replace(/\n/g, " ")
            //     .trim()
            // );
            console.log(doc);
          }
        });
      console.log(atmList);
      atmList.push(response.data);
      fs.writeFileSync(
        "../data/century_bank_atm.json",
        JSON.stringify(atmList, null, 4)
      );
      console.log("File successfully written!");
    })
    .catch(error => {
      console.log(error);
    });
}

makeGetRequest();
