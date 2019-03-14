const router = require("express").Router();
const BullionController = require("./bullion.controller");

router.get("/", async (req, res, next) => {
  await BullionController.create();
  res.send("Success");
});

module.exports = router;
