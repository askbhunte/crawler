const router = require("express").Router();
const horoscopeScraper = require("./scraper.horoscope");

router.get("/", async (req, res, next) => {
  let horoscopes = [
    "libra",
    "aries",
    "leo",
    "Virgo",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
    "Gemini",
    "Cancer",
    "Taurus"
  ];
  let data;
  for (let i = 0; i < horoscopes.length; i++) {
    data = await horoscopeScraper(horoscopes[i]);
  }
  res.send(data);
});

module.exports = router;
