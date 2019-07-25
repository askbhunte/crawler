const axios = require("axios");
const config = require("config");
const CrawlUtils = require("./utils");

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
      "bharatpur"
      // "chitawan",
      // "kathmandu",
      // "pokhara",
      // "biratnagar",
      // "mahendranagar",
      // "birgunj",
      // "lalitpur",
      // "dharan",
      // "janakpur",
      // "butwal"
    ];
    for (var loc of group_location) {
      let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=hospital+in+${loc}+nepal&key=AIzaSyDcXL_WOyZoso6rhtOxXrCj01tL4acP4PE`;
      let { data } = await axios.get(url);
      let res = data.results;
      arr.push(...res);
      var token = data.next_page_token;
      while (true) {
        this.sleep(2000);
        if (token) {
          url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=hospital+in+${loc}+nepal&key=AIzaSyDcXL_WOyZoso6rhtOxXrCj01tL4acP4PE`;
          url = url + "&pagetoken=" + encodeURI(token);
          let res = await axios.get(url);
          let nxtData = res.data.results;
          arr.push(...nxtData);
          if (res.data) {
            token = res.data.next_page_token;
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }

    let results = [];
    let unique = Object.values(arr.reduce((acc, cur) => Object.assign(acc, { [cur.id]: cur }), {}));

    for (let element of unique) {
      let ref = element.photos && element.photos.length ? element.photos[0].photo_reference : null;
      if (ref) {
        let { data, ...res } = await axios.get(
          `https://maps.googleapis.com/maps/api/place/photo?photoreference=${ref}&sensor=false&maxwidth=200&key=AIzaSyDcXL_WOyZoso6rhtOxXrCj01tL4acP4PE`
        );
        element.img_src = res.request.res.responseUrl;
      }
      element.location = {
        type: "Point",
        coordinates: [element.geometry.location.lat, element.geometry.location.lng]
      };
      element.type = type;
      results.push(element);
    }
    return results;
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
