const router = require("express").Router();
const { SecureUI } = require("../utils/secure");
const crawler = require("../crawler");

/* GET home page. */
router.get("/:service", async (req, res, next) => {
  try {
    let func = "process";
    let serviceString = req.params.service;
    let funcSep = serviceString.lastIndexOf("::");
    if (funcSep > -1) func = serviceString.substring(funcSep + 2, serviceString.length);

    let pathEnd = funcSep > -1 ? funcSep : serviceString.length;
    let pathString = serviceString.substring(0, pathEnd);
    let paths = pathString.split(">");
    let selector = crawler;
    paths.forEach(p => {
      selector = selector[p];
    });
    let data = "Not Implemented";
    if (typeof selector[func] === "function") {
      data = await selector[func]();
    }
    res.json(data);
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = router;
