const router = require("express").Router();
const qfxscraper = require("./scraper.qfx");
router.get("/", async (req, res, next) => {
  let data = await qfxscraper();
  res.send(data);
});

module.exports = router;
