const router = require("express").Router();
const stockscraper = require("./scraper.stock");
const scraper = require("../../utils/scraper");

router.get("/", async (req, res, next) => {
  let data = await stockscraper();
  res.json(data);
});

module.exports = router;
