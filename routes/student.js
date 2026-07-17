const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isTeacher, validateStudent } = require("../middleware.js");
const studentsController = require("../controllers/students.js");

router.route("/")
    .get(isLoggedIn, isTeacher, wrapAsync(studentsController.index))
    .post(isLoggedIn, isTeacher, validateStudent, wrapAsync(studentsController.createStudent));

// New Route
router.get("/new", isLoggedIn, isTeacher, studentsController.renderNewForm);

router.route("/:id")
    .get(isLoggedIn, isTeacher, wrapAsync(studentsController.show))
    .put(isLoggedIn, isTeacher, validateStudent, wrapAsync(studentsController.updateStudent))
    .delete(isLoggedIn, isTeacher, wrapAsync(studentsController.destroyStudent));

// Edit Route
router.get("/:id/edit", isLoggedIn, isTeacher, wrapAsync(studentsController.renderEditForm));

module.exports = router;