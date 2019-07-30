const axios = require("axios");
const config = require("config");

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
  }
};
