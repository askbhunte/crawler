const router = require("express").Router();
const config = require("config");

if (config.has("app.enableSocial")) {
  if (config.get("app.enableSocial")) {
    require("../utils/passport");
  }
}

const uiRouter = require("./ui.routes");
const apiRouter = require("./api.routes");
const serviceRouter = require("./services.routes");

router.use("/", uiRouter);
router.use("/api/v1", apiRouter);
router.use("/services", serviceRouter);

module.exports = router;
