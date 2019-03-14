const router = require("express").Router();
const ForexController = require("./forex.controller");

router.get("/", async (req, res, next) => {
  await ForexController.create();
  res.send("Success");
});

module.exports = router;
