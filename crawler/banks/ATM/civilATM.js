const axios = require("axios");
const cheerio = require("cheerio");
let url = "http://www.civilbank.com.np/page/filter_branch";

async function civil() {
  let { data } = await axios.get(url);
  console.log(data.branch_data);
}
civil();
// module.exports = new Grande();
