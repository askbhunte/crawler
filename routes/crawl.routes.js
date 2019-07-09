const router = require("express").Router();
const { SecureUI } = require("../utils/secure");
const crawler = require("../crawler");

const services = {
  fmd_restaurants: () => {
    return crawler.foodmandu.processRestaurants();
  },
  qfx_movies: () => {
    return crawler.qfx.process();
  },
  qfx_shows: () => {
    return crawler.qfx.processShows();
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
