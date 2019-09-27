const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");
const moment = require("moment");
const utils = require("./utils");

const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

let baseUrl = "http://kalimatimarket.gov.np/home/rpricelist";

let products = {
  "Tomato Big(Nepali)": "tomato",
  "Tomato Big(Indian)": "tomato",
  "Tomato Small": "tomato",
  "Tomato Small(Tunnel)": "tomato",
  "Tomato Small(Indian)": "tomato",
  "Potato Red": "potato",
  "Potato Red(Indian)": "potato",
  "Potato Red(Mude)": "potato",
  "Potato White": "potato",
  "Onion Dry": "onion",
  "Carrot(Local)": "carrot",
  "Cabbage(Local)": "cabbage",
  "Cauli Local": "cauliflower",
  "Raddish White(Local)": "raddish",
  "Raddish White(Hybrid)": "raddish",
  "Brinjal Long": "brinjal",
  "Cow pea(Long)": "pea",
  "Cowpea(Short)": "pea",
  "French Bean(Local)": "bean",
  "French Bean(Hybrid)": "bean",
  "Soyabean Green": "soyabean",
  "Bitter Gourd": "gourd",
  "Bottle Gourd": "gourd",
  "Pointed Gourd(Local)": "gourd",
  "Smooth Gourd": "gourd",
  "Pumpkin": "pumpkin",
  "Squash(Round)": "squash",
  "Okara": "okara",
  "Christophine": "christophine",
  "Brd Leaf Mustard": "mustard",
  "Spinach Leaf": "spinach",
  "Mustard Leaf": "mustard",
  "Onion Green": "onion",
  "Mushroom(Kanya)": "mushroom",
  "Mushroom(Button)": "mushroom",
  "Sugarbeet": "sugarbeet",
  "Lettuce": "lettuce",
  "Celery": "celery",
  "Parseley": "parseley",
  "Mint": "mint",
  "Turnip A": "turnip",
  "Tamarind": "tamarind",
  "Bamboo Shoot": "tama",
  "Tofu": "tofu",
  "Gundruk": "gundruk",
  "Apple(Jholey)": "apple",
  "Banana": "banana",
  "Lime": "lime",
  "Pomegranate": "pomegranate",
  "Water Melon(Green)": "watermelon",
  "Sweet Orange": "orange",
  "Pineapple": "pineapple",
  "Cucumber(Local)": "cucumber",
  "Cucumber(Hybrid)": "cucumber",
  "Pear(Chinese)": "pear",
  "Papaya(Indian)": "papaya",
  "Mombin": "mombin",
  "Ginger": "ginger",
  "Chilli Dry": "chilli",
  "Chilli Green": "chilli",
  "Chilli Green(Akbare)": "chilli",
  "Capsicum": "capsicum",
  "Garlic Green": "garlic",
  "Coriander Green": "coriander",
  "Garlic Dry Chinese": "garlic",
  "Garlic Dry Nepali": "garlic",
  "Fish Fresh(Rahu)": "fish",
  "Fish Fresh(Bachuwa)": "fish",
  "Fish Fresh(Chhadi)": "fish",
  "Fish Fresh(Mungari)": "fish"
}

class Vegetable {
  constructor() { }
  async scrape() {
    await axios.get("http://kalimatimarket.gov.np/home/language/EN", { jar: cookieJar, withCredentials: true })

    let { data } = await axios.get(baseUrl, { jar: cookieJar, withCredentials: true });
    const $ = cheerio.load(data);
    data = [];
    $("table")
      .find("tr")
      .each(function (i, elem) {
        data[i] = {
          name: $(this)
            .find("td:nth-child(1)")
            .text()
            .trim(),
          unit: $(this)
            .find("td:nth-child(2)")
            .text()
            .trim(),
          min: $(this)
            .find("td:nth-child(3)")
            .text()
            .trim(),
          max: $(this)
            .find("td:nth-child(4)")
            .text()
            .trim(),
          avg: $(this)
            .find("td:nth-child(5)")
            .text()
            .trim()
        };
      });

    let payload = []

    data.forEach(d => {
      let group = products[d.name];
      if (group) {
        d.group = group;
        if (d.unit)
          d.unit = d.unit.toLowerCase();
        payload.push(d)
      }
    });

    return payload;
  }
  async process() {
    let data = await this.scrape();
    //return console.log(data);
    data = await utils.uploadData({
      path: "/commodity",
      data
    });
    return data;
  }
}
module.exports = new Vegetable();
