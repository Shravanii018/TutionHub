const mongoose = require("mongoose");
const { sampleStudents, sampleAnnouncements, sampleNotes } = require("./data.js");
const User = require("../models/user.js");
const Announcement = require("../models/announcement.js");
const Note = require("../models/note.js");
const Attendance = require("../models/attendance.js");
const Fee = require("../models/fee.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/tuitionhub";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    // clear all existing data
    await User.deleteMany({});
    await Announcement.deleteMany({});
    await Note.deleteMany({});
    await Attendance.deleteMany({});
    await Fee.deleteMany({});

    // create the teacher account first
    const teacher = new User({
        username: "deepali_maam",
        fullName: "Mrs. Deepali",
        email: "deepali.jagtap2012@gmail.com",
        phone: "9970300610",
        role: "teacher",
    });
    await User.register(teacher, "Avani@10");   // passport-local-mongoose handles password hashing
    console.log("teacher account created");

    // create student accounts
    const studentDocs = [];
    for (let s of sampleStudents) {
        const student = new User(s);
        await User.register(student, "student123");  // default password for all sample students
        studentDocs.push(student);
    }
    console.log("student accounts created");

    // seed announcements — link to teacher
    const announcementsWithTeacher = sampleAnnouncements.map((a) => ({
        ...a,
        createdBy: teacher._id,
    }));
    await Announcement.insertMany(announcementsWithTeacher);
    console.log("announcements seeded");

    // seed notes — link to teacher
    const notesWithTeacher = sampleNotes.map((n) => ({
        ...n,
        uploadedBy: teacher._id,
    }));
    const insertedNotes = await Note.insertMany(notesWithTeacher);
    console.log("notes seeded");

    // seed attendance records for each student for last 3 days
    const today = new Date();
    const attendanceRecords = [];
    for (let student of studentDocs) {
        for (let i = 0; i < 3; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            attendanceRecords.push({
                student: student._id,
                date,
                status: Math.random() > 0.3 ? "present" : "absent",  // mostly present
                markedBy: teacher._id,
            });
        }
    }
    await Attendance.insertMany(attendanceRecords);
    console.log("attendance records seeded");

    // seed fee records for each student for current month
    const feeRecords = studentDocs.map((student) => ({
        student: student._id,
        amount: 2000,
        month: "June 2026",
        paid: Math.random() > 0.5,   // randomly mark some as paid
    }));
    await Fee.insertMany(feeRecords);
    console.log("fee records seeded");

    console.log("✅ Database initialized successfully!");
    mongoose.connection.close();
};

initDB();