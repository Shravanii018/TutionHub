const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isTeacher, validateNote } = require("../middleware.js");
const contentController = require("../controllers/content.js");
const multer = require("multer");

// use memory storage — file goes to buffer, we upload to cloudinary manually
const upload = multer({ storage: multer.memoryStorage() });

router.route("/")
    .get(isLoggedIn, wrapAsync(contentController.index))
    .post(isLoggedIn, isTeacher, upload.single("note[file]"), validateNote, wrapAsync(contentController.createContent));

router.get("/new", isLoggedIn, isTeacher, contentController.renderNewForm);

router.route("/:id")
    .get(isLoggedIn, wrapAsync(contentController.show))
    .delete(isLoggedIn, isTeacher, wrapAsync(contentController.destroyContent));

module.exports = router;