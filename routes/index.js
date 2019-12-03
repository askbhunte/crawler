const router = require("express").Router();
const config = require("config");

if (config.has("app.enableSocial")) {
  if (config.get("app.enableSocial")) {
    require("../utils/passport");
  }
}

const crawlRouter = require("./crawl.routes");
const uiRouter = require("./ui.routes");
const apiRouter = require("./api.routes");

router.use("/", uiRouter);
router.use("/crawl", crawlRouter);
router.use("/api/v1", apiRouter);

module.exports = router;
