const axios = require("axios");
const cheerio = require("cheerio");
let date = new Date();
let year = date.getFullYear();
let month = (date.getMonth() < 10 ? "0" : "") + (date.getMonth() + 1);
let day = (date.getDate() < 10 ? "0" : "") + date.getDate();
let url = `https://nrb.org.np/exportdsdForexJSON.php?YY=${year}&MM=${month}&DD=${day}&YY1=${year}&MM1=${month}&DD1=${day}`;
const { templates, sendMail } = require("../../utils/messenger");

const ForexModel = require("./forex.model");

class Forex {
  constructor() {}

  async create() {
    let res = await axios.get(url);
    let forex = res.data.Conversion.Currency;
    forex = forex.map(d => {
      return {
        date: d.Date,
        base_currency: d.BaseCurrency,
        target_currency: d.TargetCurrency,
        base_value: d.BaseValue,
        buy: d.TargetBuy,
        sell: d.TargetSell
      };
    });

    let test = await ForexModel.deleteMany({
      $where: `this.date.toJSON().slice(0, 10) == "${year}-${month}-${day}"`
    });
    try {
      return ForexModel.insertMany(forex);
    } catch (e) {
      sendMail({
        to: "bibek.gaihre@rumsan.com",
        template: templates.shareEvent
      });
      console.log(e);
    }
  }
}

module.exports = new Forex();
