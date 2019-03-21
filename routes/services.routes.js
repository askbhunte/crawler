const router = require("express").Router();

const movieRouter = require("../services/movie");
const forexRouter = require("../services/forex");
const flightRouter = require("../services/flight");
const newsRouter = require("../services/news");
const pollutionRouter = require("../services/pollution");
const stockRouter = require("../services/stock");
const bullionRouter = require("../services/bullion");
const holidayRouter = require("../services/holiday");
const horoscopeRouter = require("../services/horoscope");

router.use("/holiday", holidayRouter);
router.use("/bullion", bullionRouter);
router.use("/horoscope", horoscopeRouter);
router.use("/news", newsRouter);
router.use("/forex", forexRouter);
router.use("/movie", movieRouter);
router.use("/flight", flightRouter);
// router.use("/pollution", pollutionRouter);
router.use("/stock", stockRouter);
router.use("/bullion", bullionRouter);

module.exports = router;
