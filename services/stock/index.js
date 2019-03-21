const router = require("express").Router();
const stockscraper = require("./scraper.stock");
router.get("/", async (req, res, next) => {
  let data = await stockscraper();
  res.send(data);
});

module.exports = router;
