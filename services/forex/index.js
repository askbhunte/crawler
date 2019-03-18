const router = require("express").Router();
const forexScraper = require("./scraper.forex");
router.get("/", async (req, res, next) => {
  let data = await forexScraper();
  res.send(data);
});

module.exports = router;
