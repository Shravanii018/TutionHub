const User = require("../models/user.js");

// show all students (teacher only)
module.exports.index = async (req, res) => {
    const allStudents = await User.find({ role: "student" });
    res.render("students/index.ejs", { allStudents });
};

// show single student profile
module.exports.show = async (req, res) => {
    let { id } = req.params;
    const student = await User.findById(id);
    if (!student) {
        req.flash("error", "Student not found!");
        return res.redirect("/students");
    }
    res.render("students/show.ejs", { student });
};

// render form to add new student
module.exports.renderNewForm = (req, res) => {
    res.render("students/new.ejs");
};

// add new student
module.exports.createStudent = async (req, res) => {
    try {
        let { username, fullName, email, phone, password } = req.body.student;
        const newStudent = new User({ username, fullName, email, phone, role: "student" });
        await User.register(newStudent, password);
        req.flash("success", "New student added successfully!");
        res.redirect("/students");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/students/new");
    }
};

// render edit form
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const student = await User.findById(id);
    if (!student) {
        req.flash("error", "Student not found!");
        return res.redirect("/students");
    }
    res.render("students/edit.ejs", { student });
};

// update student details
module.exports.updateStudent = async (req, res) => {
    let { id } = req.params;
    await User.findByIdAndUpdate(id, { ...req.body.student });
    req.flash("success", "Student details updated!");
    res.redirect(`/students/${id}`);
};

// delete student
module.exports.destroyStudent = async (req, res) => {
    let { id } = req.params;
    await User.findByIdAndDelete(id);
    req.flash("success", "Student removed successfully!");
    res.redirect("/students");
};