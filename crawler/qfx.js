const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");
const moment = require("moment");
const CrawlUtils = require("./utils");

let baseUrl = "https://www.qfxcinemas.com/home";
let apiUrl = "https://api.qfxcinemas.com/api/public/NowShowing";

class QFX {
  constructor() {}

  async scrapMovieList() {
    let { data } = await axios.get(apiUrl);
    return data.data;
  }

  async process() {
    let movies = await this.scrapMovieList();
    let movieList = await CrawlUtils.uploadData({
      path: "/movies",
      data: movies
    });
    return movieList.length;
  }
}
module.exports = new QFX();
