var router = require("express").Router();
var fetch = require("../../controllers/fetch");

router.get("/", fetch.scrapeTheNews);

module.exports = router;