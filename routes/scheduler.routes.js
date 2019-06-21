const router = require("express").Router();
const scheduler = require("../config/scheduler.json");
const stockScraper = require("../services/stock/scraper.stock");
const bullionScraper = require("../services/bullion/scraper.bullion");
const forexScraper = require("../services/forex/scraper.forex");
const holidayScraper = require("../services/holiday/scraper.holiday");
const horoscopeScraper = require("../services/horoscope/scraper.horoscope");
const qfxScraper = require("../services/movie/scraper.qfx");
const myrScraper = require("../services/news/scraper.myr");
const thtScraper = require("../services/news/scraper.tht");
const tkpScraper = require("../services/news/scraper.tkp");

router.get("/", async (req, res, next) => {
  try {
    let date = new Date();
    date = date.toTimeString().split(" ")[0];
    let obj = {
      stock: stockScraper(),
      movies: qfxScraper(),
      forex: forexScraper(),
      bullion: bullionScraper(),
      horoscope: horoscopeScraper(),
      holiday: holidayScraper(),
      forex: holidayScraper(),
      myr: myrScraper(),
      tht: thtScraper(),
      tkp: tkpScraper()
    };
    let keys = Object.keys(obj);
    let data = [];
    for (var key of keys) {
      let { start_time, end_time } = scheduler[key];
      if (date >= start_time && date <= end_time) {
        data.push(await obj[key]);
      }
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
