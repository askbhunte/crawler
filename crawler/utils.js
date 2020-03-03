const axios = require("axios");
const config = require("config");
const fs = require("fs");

let botUrl = config.get("services.nepalbot.url");

module.exports = {
  titleCase: str => {
    return str
      .toLowerCase()
      .split(" ")
      .map(function(word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join(" ");
  },
  uploadData: async payload => {
    let { data } = await axios({
      url: botUrl + payload.path || "",
      method: payload.method || "POST",
      data: payload.data || null
    });
    return data;
  },

  getData: async payload => {
    let { data } = await axios({
      url: botUrl + payload.path || "",
      method: payload.method || "GET"
    });
    return data;
  },

  getDataFromFile: dataFile => {
    let prevData = {};
    try {
      prevData = fs.readFileSync(dataFile);
      prevData = JSON.parse(prevData);
      prevData = prevData;
    } catch (e) {
      console.log(e);
    }
    return prevData;
  },

  getChangeEmoji: (current, prev) => {
    if (!prev) prev = current;
    if (current > prev) return "👆🏻";
    else if (prev > current) return "👇🏻";
    else return "";
  }
};
