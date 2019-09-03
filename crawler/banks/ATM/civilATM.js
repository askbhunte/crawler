const axios = require("axios");
const cheerio = require("cheerio");
let url = "http://www.civilbank.com.np/page/filter_branch";
class Civil {
  constructor() {}
  async branch() {
    return axios.get(url).branch_data;
  }

  async process() {
    let processed = [];
    let data = await this.branch();
    if (!data) return [];
    for (var i of data) {
      let payload = {};
      payload.name = i.name;
      delete i.name;
      payload.address = i.address;
      delete i.address;
      payload.location = {
        type: "Point",
        coordinates: [parseFloat(i.latitude), parseFloat(i.longitude)]
      };
      delete i.latitude, i.longitude;
      payload.source = "civil";
      payload.extras = i;
      processed.push(payload);
    }
    return processed;
  }
}

// let civil = new Civil();
// civil
//   .process()
//   .then(console.log)
//   .catch(console.error);

module.exports = new Civil();
