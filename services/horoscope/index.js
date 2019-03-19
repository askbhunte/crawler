const router = require("express").Router();
const horoscopeScraper = require("./scraper.horoscope");

router.get("/", async (req, res, next) => {
  let horoscopes = [
    "libra",
    "aries",
    "leo",
    "virgo",
    "scorpio",
    "sagittarius",
    "capricorn",
    "aquarius",
    "pisces",
    "gemini",
    "cancer",
    "taurus"
  ];
  let data;
  for (let i = 0; i < horoscopes.length; i++) {
    data = await horoscopeScraper(horoscopes[i]);
  }
  res.sendStatus(200);
});

module.exports = router;
