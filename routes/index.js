var router = require("express").Router();
var apiRoute = require("./api");
var viewRoute = require("./view");

router.use("/api", apiRoute);
router.use("/", viewRoute);

module.exports = router;