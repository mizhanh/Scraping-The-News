var router = require("express").Router();
var note = require("../../controllers/notes");

router.get("/all", note.findAll)
router.get("/:id", note.findOne);
router.post("/", note.create);
router.delete("/:id", note.delete);

module.exports = router;