const router = require("express").Router();
const forexScraper = require("./scraper.forex");
router.get("/", async (req, res, next) => {
  let data = await forexScraper();
  res.sendStatus(200);
});

module.exports = router;
