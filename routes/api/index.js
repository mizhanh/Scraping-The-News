var router = require("express").Router();
var fetchRoute = require("./fetch");
var noteRoute = require("./notes");
var headlineRoute = require("./headlines");

router.use("/fetch", fetchRoute);
router.use("/notes", noteRoute);
router.use("/headlines", headlineRoute);

module.exports = router;