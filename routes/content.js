const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isTeacher, validateNote } = require("../middleware.js");
const contentController = require("../controllers/content.js");
const multer = require("multer");

// multer storage config — files saved to public/uploads/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/");
    },
    filename: function (req, file, cb) {
        // keep original name with a timestamp prefix to avoid duplicates
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

router.route("/")
    .get(isLoggedIn, wrapAsync(contentController.index))
    .post(isLoggedIn, isTeacher, upload.single("note[file]"), validateNote, wrapAsync(contentController.createContent));

// New Route
router.get("/new", isLoggedIn, isTeacher, contentController.renderNewForm);

router.route("/:id")
    .get(isLoggedIn, wrapAsync(contentController.show))
    .delete(isLoggedIn, isTeacher, wrapAsync(contentController.destroyContent));

module.exports = router;