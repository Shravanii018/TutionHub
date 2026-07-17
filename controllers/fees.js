const Fee = require("../models/fee.js");
const User = require("../models/user.js");

// show all fee records (teacher sees all, student sees only their own)
module.exports.index = async (req, res) => {
    let feeRecords;
    if (req.user.role === "teacher") {
        feeRecords = await Fee.find({}).populate("student");
    } else {
        feeRecords = await Fee.find({ student: req.user._id }).populate("student");
    }
    res.render("fees/index.ejs", { feeRecords });
};

// render form to add a new fee record (teacher only)
module.exports.renderNewForm = async (req, res) => {
    const allStudents = await User.find({ role: "student" });
    res.render("fees/new.ejs", { allStudents });
};

// create a new fee record
module.exports.createFee = async (req, res) => {
    const newFee = new Fee(req.body.fee);
    await newFee.save();
    req.flash("success", "Fee record added successfully!");
    res.redirect("/fees");
};

// mark fee as paid
module.exports.markPaid = async (req, res) => {
    let { id } = req.params;
    await Fee.findByIdAndUpdate(id, { paid: true, paidOn: new Date() });
    req.flash("success", "Fee marked as paid!");
    res.redirect("/fees");
};

// delete fee record
module.exports.destroyFee = async (req, res) => {
    let { id } = req.params;
    await Fee.findByIdAndDelete(id);
    req.flash("success", "Fee record deleted!");
    res.redirect("/fees");
};