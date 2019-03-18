const router = require("express").Router();
const bullionScraper = require("./scraper.bullion");

router.get("/", async (req, res, next) => {
  let data = await bullionScraper();
  res.send(data);
});

module.exports = router;
