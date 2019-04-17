const router = require("express").Router();
const neaScraper = require("./scraper.nea");

router.get("/", async (req, res, next) => {
  let data = await neaScraper();
  res.sendStatus(200);
});

module.exports = router;
