const router = require("express").Router();
const foodScraper = require("./scraper.food");

router.get("/", async (req, res, next) => {
  let data = await foodScraper();
  res.sendStatus(200);
});

module.exports = router;
