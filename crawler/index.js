module.exports = {
  movies: { qfx: require("./movies/qfx") },
  doctors: {
    grande: require("./doctors/grande"),
    mediciti: require("./doctors/mediciti")
  },
  restaurants: { foodmandu: require("./restaurants/foodmandu") },
  business: {
    market: require("./market"),
    stocks: require("./stock")
  },
  bullion: require("./bullion"),
  holiday: require("./holiday"),
  horoscope: require("./horoscope"),
  hospital: require("./hospital")
};
