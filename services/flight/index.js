const router = require("express").Router();
const departurescraper = require("./scraper.departure");
const arrivalscraper = require("./scraper.arrival");

router.get("/departure", async (req, res, next) => {
  let data = await departurescraper();
  res.send("Success");
});

router.get("/arrival", async (req, res, next) => {
  let data = await arrivalscraper();
  res.send("success");
});

module.exports = router;
