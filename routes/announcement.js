const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isTeacher, validateAnnouncement } = require("../middleware.js");
const announcementsController = require("../controllers/announcements.js");

router.route("/")
    .get(isLoggedIn, wrapAsync(announcementsController.index))
    .post(isLoggedIn, isTeacher, validateAnnouncement, wrapAsync(announcementsController.createAnnouncement));

// New Route
router.get("/new", isLoggedIn, isTeacher, announcementsController.renderNewForm);

// Delete Route
router.delete("/:id", isLoggedIn, isTeacher, wrapAsync(announcementsController.destroyAnnouncement));

module.exports = router;