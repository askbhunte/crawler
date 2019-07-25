const router = require("express").Router();
const { SecureUI } = require("../utils/secure");
const crawler = require("../crawler");

const services = {
  fmd_restaurants: () => {
    return crawler.foodmandu.processRestaurants();
  },
  hospital: () => {
    return crawler.hospital.process();
  },
  grande: () => {
    return crawler.grande.process();
  },
  qfx_movies_nowshowing: () => {
    return crawler.qfx.process();
  },
  qfx_shows: () => {
    return crawler.qfx.processShows();
  },
  mediciti: () => {
    return crawler.mediciti.process();
  },
  bullion: () => {
    return crawler.bullion.process();
  },
  holiday: () => {
    return crawler.holiday.process();
  },
  horoscope: () => {
    return crawler.horoscope.process();
  },
  stock: () => {
    return crawler.stock.process();
  }
};

/* GET home page. */
router.get("/:service", async (req, res, next) => {
  let service = services[req.params.service];
  if (service) {
    service()
      .then(d => res.json(d))
      .catch(next);
  } else {
    res.json({ success: false, message: "service does not exist" });
  }
});

module.exports = router;
