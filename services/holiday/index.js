const router = require("express").Router();
const holidayScraper = require("./scraper.holiday");

router.get("/", async (req, res, next) => {
  let data = await holidayScraper();
  res.json(data);
});

module.exports = router;
