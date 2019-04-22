const router = require("express").Router();
const qfxscraper = require("./scraper.qfx");
router.get("/", async (req, res, next) => {
  let data = await qfxscraper();
  res.sendStatus(200);
});

module.exports = router;
