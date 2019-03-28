const router = require("express").Router();
const holidayScraper = require("./scraper.holiday");

router.get("/", async (req, res, next) => {
  let data = await holidayScraper();
  res.sendStatus(200);
});

module.exports = router;
