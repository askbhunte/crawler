const router = require("express").Router();
const stockscraper = require("./scraper.stock");
router.get("/", async (req, res, next) => {
  let data = await stockscraper();
  res.json(data);
});

module.exports = router;
