const router = require("express").Router();
const qfxscraper = require("./scraper.qfx");
router.get("/", async (req, res, next) => {
  let data = await qfxscraper();
  console.log(data);
  res.send(data);
});

module.exports = router;
