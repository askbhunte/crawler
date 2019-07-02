const router = require("express").Router();
const tht = require("./scraper.tht");
const tkp = require("./scraper.tkp");
const myr = require("./scraper.myr");
router.get("/tht", async (req, res, next) => {
  let categories = [
    "kathmandu",
    "business",
    "sports",
    "world",
    "nepal",
    "education",
    "entertainment",
    "environment",
    "science-technology",
    "opinion"
  ];

  let data;
  for (let i = 0; i < categories.length; i++) {
    data = await tht(categories[i]);
  }
  res.json(data);
});

router.get("/tkp", async (req, res, next) => {
  let categories = ["sports", "national", "technology", "world", "escalate", "health-living"];
  let data;
  for (let i = 0; i < categories.length; i++) {
    data = await tkp(categories[i]);
  }
  res.json(data);
});
router.get("/myr", async (req, res, next) => {
  let categories = ["politics", "economy", "world", "sports", "society", "opinion"];
  let data;
  for (let i = 0; i < categories.length; i++) {
    data = await myr(categories[i]);
  }
  res.json(data);
});

module.exports = router;
