const axios = require("axios");
const cheerio = require("cheerio");
let baseUrl = "https://www.sc.com/np/atms-and-branches.html";
class Standard {
  async branch() {
    let arr = [];
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    $("tr").each(function(i, elem) {
      let address = $(this)
        .find("td")
        .eq("0")
        .text()
        .split("\n")[2];
      address = String(address).trim();
      let phone = String(
        $(this)
          .find("td")
          .eq("0")
          .text()
          .split("\n")[4]
      ).replace(/([a-zA-Z :\t])/g, "");
      let manager = String(
        $(this)
          .find("td")
          .text()
          .split("Branch Manager:")[2]
      ).trim();
      arr[i] = {
        name: $(this)
          .find("td")
          .eq("0")
          .text()
          .split("\n")[0],
        address,
        phone,
        manager
      };
    });
    arr = arr.slice(22, 28);
    arr = arr.filter(el => {
      return el.name !== "";
    });
    console.log(arr);
    return arr;
  }
  async process() {
    let sc = await this.branch();
    await CrawlUtils.uploadData({
      path: "/sc",
      data: sc
    });
    return mega.length;
  }
}
const a = new Standard();
a.branch();
// module.exports = new Prime();
