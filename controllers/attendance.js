const Attendance = require("../models/attendance.js");
const User = require("../models/user.js");

// show attendance page — lists all students with today's status (teacher only)
module.exports.index = async (req, res) => {
    const allStudents = await User.find({ role: "student" });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // fetch today's attendance records
    const todayRecords = await Attendance.find({ date: today });

    // map studentId -> status for easy lookup in EJS
    const attendanceMap = {};
    for (let record of todayRecords) {
        attendanceMap[record.student.toString()] = record.status;
    }

    res.render("attendance/index.ejs", { allStudents, attendanceMap, today });
};

// mark attendance for all students (teacher submits a form with all students)
module.exports.markAttendance = async (req, res) => {
    const { attendance } = req.body;   // attendance = { studentId: "present"/"absent", ... }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // delete today's existing records first (so teacher can re-mark if needed)
    await Attendance.deleteMany({ date: today });

    const records = Object.entries(attendance).map(([studentId, status]) => ({
        student: studentId,
        date: today,
        status,
        markedBy: req.user._id,
    }));

    await Attendance.insertMany(records);
    req.flash("success", "Attendance marked successfully!");
    res.redirect("/attendance");
};

// view attendance history for a specific student
module.exports.studentHistory = async (req, res) => {
    let { id } = req.params;
    const student = await User.findById(id);
    if (!student) {
        req.flash("error", "Student not found!");
        return res.redirect("/students");
    }
    const records = await Attendance.find({ student: id }).sort({ date: -1 });

    // calculate attendance percentage
    const total = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    res.render("attendance/history.ejs", { student, records, percentage });
};