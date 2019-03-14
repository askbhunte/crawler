const axios = require("axios");
const cheerio = require("cheerio");

const { templates, sendMail } = require("../../utils/messenger");

const NewsModel = require("./news.model");

class News {
  constructor() {}

  async create() {
    let data = await services.combine();

    try {
      return NewsModel.insertMany(data);
    } catch (e) {
      sendMail({
        to: "bibek.gaihre@rumsan.com",
        template: templates.shareEvent
      });
      console.log(e);
    }
  }
}

module.exports = new News();
