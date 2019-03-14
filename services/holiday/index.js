const router = require("express").Router();
const HolidayController = require("./holiday.controller");

router.get("/", async (req, res, next) => {
  await HolidayController.create();
  res.send("Success");
});

module.exports = router;
