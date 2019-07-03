const router = require("express").Router();
const tht = require("./scraper.tht");
const tkp = require("./scraper.tkp");
const myr = require("./scraper.myr");
router.get("/tht", async (req, res, next) => {
  let data = await tht();
  res.json(data);
});

router.get("/tkp", async (req, res, next) => {
  let data = await tkp();
  res.json(data);
});
router.get("/myr", async (req, res, next) => {
  let data = await myr();
  res.json(data);
});

module.exports = router;
