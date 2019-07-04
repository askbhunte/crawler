const router = require("express").Router();
const horoscopeScraper = require("./scraper.horoscope");

router.get("/", async (req, res, next) => {
  let data = await horoscopeScraper();
  res.json(data);
});

module.exports = router;
