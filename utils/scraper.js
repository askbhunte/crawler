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
      subject: "AskBhunte Scraping Error: " + this.name,
      body: e
    });
  }

  async saveToBotApi(data) {
    if (data.Conversion) {
      data = data.Conversion.Currency;
    }
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
        data = extractor(response.data);
      } else {
        const html = response.data;
        const $ = cheerio.load(html);
        data = extractor($);
      }
      await this.saveToBotApi(data);
      return data;
    } catch (e) {
      console.log(e.message);
      let msg = e.message;
      if (errorHandler) errorHandler(msg);
      else this.handleError(msg);
    }
  }
}

module.exports = Scraper;
