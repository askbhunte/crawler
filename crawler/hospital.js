const axios = require("axios");
const config = require("config");
const CrawlUtils = require("./utils");

let botUrl = config.get("services.nepalbot.url");

class Hospital {
  async sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if (new Date().getTime() - start > milliseconds) {
        break;
      }
    }
  }
  async scrapHospital() {
    let arr = [];
    let type = "hospital";
    let group_location = [
      "bharatpur",
      "kathmandu",
      "pokhara"
      // "biratnagar",
      // "mahendranagar",
      // "birgunj",
      // "lalitpur",
      // "dharan",
      // "janakpur",
      // "butwal"
    ];
    for (let i = 0; i < group_location.length; i++) {
      let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=hospital+in+${
        group_location[i]
      }+nepal&key=AIzaSyDcXL_WOyZoso6rhtOxXrCj01tL4acP4PE`;
      let { data } = await axios.get(url);
      let res = data.results;
      arr.push(...res);
      var token = data.next_page_token;
      while (true) {
        this.sleep(1000);
        if (token) {
          url = url + "&pagetoken=" + encodeURI(token);
          let res = await axios.get(url);
          let nxtData = res.data.results;
          arr.push(...nxtData);
          if (res.data) token = nxtData.next_page_token;
          else break;
        } else {
          break;
        }
      }
    }

    arr.map(element => {
      element.type = type;
      element.lat = element.geometry.location.lat;
      element.long = element.geometry.location.lng;
    });
    return arr;
  }

  async process() {
    let hospitalList = await this.scrapHospital();
    await CrawlUtils.uploadData({
      path: "/poi",
      data: hospitalList
    });
    return hospitalList.length;
  }
}
module.exports = new Hospital();
