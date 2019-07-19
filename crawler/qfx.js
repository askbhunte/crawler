const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");
const moment = require("moment");
const CrawlUtils = require("./utils");

let baseUrl = "https://www.qfxcinemas.com/home";
let apiUrl = "https://staging.qfxcinemas.com:3000/api/public/NowShowing";

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

class QFX {
  constructor() {}

  async scrapMovieList() {
    // let { data } = await axios.get(apiUrl);
    let { data, ...res } = await axios.get(
      "https://staging.qfxcinemas.com:2005/api/public/ThumbnailImage?eventId=11"
    );
    return data.data;
  }

  async process() {
    let movies = await this.scrapMovieList();

    movieList = await CrawlUtils.uploadData({
      path: "/movies",
      data: movies
    });
    return movieList.length;
  }
}
module.exports = new QFX();
