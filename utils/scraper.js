const config = require("config");
const axios = require("axios");
const cheerio = require("cheerio");
const mailer = require("../utils/messenger");

class Scraper {
  constructor({ name, repo }) {
    this.repo = repo;
    this.name = name;
  }
  async handleError(e) {
    await mailer.sendMail({
      from: "service@rumsan.com",
      to: config.get("notification.email"),
      subject: "NepalBot Scraping Error: " + this.name,
      body: e
    });
  }

  // async makeSymbol(data) {
  //   if (data) {
  //     for (var d of data) {
  //       let symbol = "";
  //       let td = d.traded_company;
  //       if (td) {
  //         let tds = td.split(" ");
  //         if (tds) {
  //           for (var t of tds) {
  //             let tdd = t.replace(/,/g, "");
  //             tdd = tdd.replace(/./g, "");
  //             symbol += tdd.charAt(0).toUpperCase();
  //           }
  //         }
  //       }

  //       d.symbol = symbol;
  //     }
  //   }
  //   return data;
  // }
  async saveToBotApi(data) {
    let repo = this.repo;
    if (!repo.url) throw "No BOT URL specified";
    repo.method = repo.method || "POST";
    repo.data = data;
    return axios(repo);
  }
  async process({ target, extractor, errorHandler, isJson = false }) {
    try {
      target.method = target.method || "GET";
      let response = await axios(target);
      let data = null;
      if (isJson) {
        data = extractor(response.data.Conversion.Currency);
      } else {
        const html = response.data;
        const $ = cheerio.load(html);
        data = extractor($);
      }

      await this.saveToBotApi(data);
      return data;
    } catch (e) {
      //
      console.log(e);
      let msg = e.message;
      if (errorHandler) errorHandler(msg);
      else this.handleError(msg);
    }
  }
}

module.exports = Scraper;
