const router = require("express").Router();

const movieRouter = require("../services/movie");
const forexRouter = require("../services/forex");
const newsRouter = require("../services/news");
const stockRouter = require("../services/stock");
const bullionRouter = require("../services/bullion");
const holidayRouter = require("../services/holiday");
const foodRouter = require("../services/food");
const horoscopeRouter = require("../services/horoscope");

router.use("/holiday", holidayRouter);
router.use("/bullion", bullionRouter);
router.use("/horoscope", horoscopeRouter);
router.use("/news", newsRouter);
router.use("/forex", forexRouter);
router.use("/movie", movieRouter);
router.use("/stock", stockRouter);
router.use("/food", foodRouter);
router.use("/bullion", bullionRouter);

module.exports = router;
