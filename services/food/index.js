const router = require("express").Router();
const foodScraper = require("./scraper.food");

router.get("/", async (req, res, next) => {
  let data = await foodScraper();
  res.json(data);
});

module.exports = router;
