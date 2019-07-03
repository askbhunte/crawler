const router = require("express").Router();
const restaurantScraper = require("./scraper.vendor");
const menuScraper = require("./scraper.menu");

router.get("/restaurant", async (req, res, next) => {
  let data = await restaurantScraper();
  res.sendStatus(200);
});
router.get("/menu", async (req, res, next) => {
  let data = await menuScraper(511);
  res.sendStatus(200);
});

module.exports = router;
