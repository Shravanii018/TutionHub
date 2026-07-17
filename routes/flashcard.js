const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const flashcardsController = require("../controllers/flashcards.js");

// index — show all flashcard sets
router.get("/", isLoggedIn, wrapAsync(flashcardsController.index));

// generate flashcards from a specific PDF note (teacher triggers this)
router.post("/generate/:noteId", isLoggedIn, wrapAsync(flashcardsController.generate));

router.route("/:id")
    .get(isLoggedIn, wrapAsync(flashcardsController.show))
    .delete(isLoggedIn, wrapAsync(flashcardsController.destroyFlashcard));

module.exports = router;