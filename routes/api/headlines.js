var router = require("express").Router();
var headline = require("../../controllers/headlines");

router.get("/", headline.findAll);
router.delete("/:id", headline.delete);
router.put("/:id", headline.update);

module.exports = router;