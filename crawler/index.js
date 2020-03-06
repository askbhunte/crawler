module.exports = {
  banks: { atm: require("./banks/ATM"), branch: require("./banks/branch") },
  movies: { qfx: require("./movies/qfx") },
  doctors: {
    grande: require("./doctors/grande"),
    mediciti: require("./doctors/mediciti"),
    hamro: require("./doctors/hamroDocHosp")
  },
  restaurants: { foodmandu: require("./restaurants/foodmandu") },
  news: { hamropatro: require("./news/hamropatro") },
  business: {
    market: require("./market"),
    stocks: require("./stock")
  },
  bullion: require("./bullion"),
  holiday: require("./holiday"),
  horoscope: require("./horoscope"),
  hospital: require("./hospital"),
  vegetable: require("./vegetable"),
  sag: require("./sag"),
  corona: require("./corona"),
  forex: require("./forex")
};
