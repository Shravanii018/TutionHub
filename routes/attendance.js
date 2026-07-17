const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isTeacher } = require("../middleware.js");
const attendanceController = require("../controllers/attendance.js");

// index — show today's attendance (teacher only)
router.route("/")
    .get(isLoggedIn, isTeacher, wrapAsync(attendanceController.index))
    .post(isLoggedIn, isTeacher, wrapAsync(attendanceController.markAttendance));

// view attendance history for a specific student
router.get("/:id/history", isLoggedIn, isTeacher, wrapAsync(attendanceController.studentHistory));

module.exports = router;