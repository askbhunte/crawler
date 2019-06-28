const router = require("express").Router();
const food = require("./scraper.food");

router.get("/", async (req, res, next) => {
  let data = await food();
  res.send(data);
});

module.exports = router;
