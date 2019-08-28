const axios = require("axios");
const cheerio = require("cheerio");
let baseUrl = "https://www.everestbankltd.com/about/branches/";
class EverestBranch {
  async district() {
    let districts = [];
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    $("select")
      .find("option")
      .each(function() {
        if ($(this).val()) districts.push($(this).val());
      });
    return districts;
  }
  async branch() {
    let arr = [];
    let branches = [];
    for (let i of await this.district()) {
      let url = baseUrl + "?dis=" + i;
      let { data } = await axios.get(url);
      const $ = cheerio.load(data);
      $(".locationScroll")
        .find("ul")
        .find("li")
        .each(function(i, elem) {
          if (
            $(this)
              .find(".location-title")
              .text()
          )
            arr[i] = {
              name: $(this)
                .find(".location-title")
                .text()
                .replace(/\n|\t/g, ""),
              details: $(this)
                .find(".location-child-list")
                .find("li")
                .eq("0")
                .text()
                .replace(/\n|\t/g, "")
                //todo - details
                .split(","),
              lat: $(this)
                .find(".pointer,marker--locate")
                .attr("data-lat"),
              lng: $(this)
                .find(".pointer,marker--locate")
                .attr("data-lng")
            };
        });
      arr = arr.filter(el => {
        return el != null;
      });
      console.log(arr);
      branches.push(...arr);
    }
    return branches;
  }
}
const a = new EverestBranch();
a.branch();
// module.exports = new Grande();
