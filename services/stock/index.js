const router = require("express").Router();
const stockscraper = require("./scraper.stock");
router.get("/", async (req, res, next) => {
  let data = await stockscraper();
  res.sendStatus(200);
});

module.exports = router;
