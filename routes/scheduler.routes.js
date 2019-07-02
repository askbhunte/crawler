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
const foodScraper = require("../services/food/scraper.food");

let date = new Date();
date = date.toTimeString().split(" ")[0];

router.get("/minute", async (req, res, next) => {
  try {
    let obj = {
      stock: stockScraper()
    };
    let keys = Object.keys(obj);
    let data = [];
    for (var key of keys) {
      let { start_time, end_time } = scheduler[key];
      if (date >= start_time && date <= end_time) {
        data.push(await obj[key]);
      }
    }
    return data;
  } catch (e) {
    console.log(e);
  }
});

router.get("/hour", async (req, res, next) => {
  try {
    let obj = {
      stock: stockScraper(),
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
    return data;
  } catch (e) {
    console.log(e);
  }
});

router.get("/day", async (req, res, next) => {
  try {
    let obj = {
      stock: stockScraper(),
      movies: qfxScraper(),
      forex: forexScraper(),
      bullion: bullionScraper(),
      horoscope: horoscopeScraper(),
      holiday: holidayScraper(),
      myr: myrScraper(),
      tht: thtScraper(),
      tkp: tkpScraper(),
      food: foodScraper()
    };
    let keys = Object.keys(obj);
    let data = [];
    for (var key of keys) {
      let { start_time, end_time } = scheduler[key];
      if (date >= start_time && date <= end_time) {
        let aaa = await obj[key];
        // console.log(aaa);
        data.push(await obj[key]);
      }
    }
    return data;
  } catch (e) {
    console.log(e);
  }
});

router.get("/week", async (req, res, next) => {
  try {
    let obj = {
      horoscope: horoscopeScraper(),
      movies: qfxScraper(),
      bullion: bullionScraper(),
      forex: forexScraper(),
      food: foodScraper()
      // myr: myrScraper(),
      // tht: thtScraper(),
      // tkp: tkpScraper()

      // holiday: holidayScraper()
    };
    let keys = Object.keys(obj);
    let data = [];
    for (var key of keys) {
      let { start_time, end_time } = scheduler[key];
      if (date >= start_time && date <= end_time) {
        data.push(await obj[key]);
      }
    }
    res.json(data);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
