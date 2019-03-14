const router = require("express").Router();
const FlightController = require("./flight.controller");

router.get("/", async (req, res, next) => {
  await FlightController.create();
  res.send("Success");
});

module.exports = router;
