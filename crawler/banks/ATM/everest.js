const axios = require("axios");
const cheerio = require("cheerio");
let baseUrl =
  "https://www.everestbankltd.com/product-and-services/card-services/atm-location/";
class Everest {
  async branch() {
    let arr = [];
    let { data } = await axios.get(baseUrl);
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
            loc: $(this)
              .find(".location-child-list")
              .find("li")
              .text()
              .replace(/\n|\t/g, "")
              .split("District:"),
            lat: $(this)
              .find(".pointer,marker--locate")
              .attr("data-lat"),
            lng: $(this)
              .find(".pointer,marker--locate")
              .attr("data-lng")
            // phone: $(this)
            //   .find("td:nth-child(4)")
            //   .text(),
            // fax: $(this)
            //   .find("td:nth-child(5)")
            //   .text(),
            // cntct_prsn: $(this)
            //   .find("td:nth-child(6)")
            //   .text()
          };
      });
    arr = arr.filter(el => {
      return el != null;
    });
    console.log(arr);
    return arr;
  }
  //   async process() {
  //     let grandeDoc = await this.grandeDoc();
  //     console.log(grandeDoc);
  //     await CrawlUtils.uploadData({
  //       path: "/nmb",
  //       data: grandeDoc
  //     });
  //     return grandeDoc.length;
  //   }
}
const a = new Everest();
a.branch();
// module.exports = new Grande();
