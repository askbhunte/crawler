const router = require("express").Router();
const NewsController = require("./news.controller");

router.get("/", async (req, res, next) => {
  await NewsController.create();
  res.send("Success");
});

module.exports = router;
