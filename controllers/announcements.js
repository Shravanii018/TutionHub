const Announcement = require("../models/announcement.js");

// show all announcements (visible to everyone)
module.exports.index = async (req, res) => {
    const allAnnouncements = await Announcement.find({}).populate("createdBy").sort({ createdAt: -1 });
    res.render("announcements/index.ejs", { allAnnouncements });
};

// render new announcement form (teacher only)
module.exports.renderNewForm = (req, res) => {
    res.render("announcements/new.ejs");
};

// create new announcement
module.exports.createAnnouncement = async (req, res) => {
    const newAnnouncement = new Announcement(req.body.announcement);
    newAnnouncement.createdBy = req.user._id;
    await newAnnouncement.save();
    req.flash("success", "Announcement posted successfully!");
    res.redirect("/announcements");
};

// delete announcement (teacher only)
module.exports.destroyAnnouncement = async (req, res) => {
    let { id } = req.params;
    await Announcement.findByIdAndDelete(id);
    req.flash("success", "Announcement deleted!");
    res.redirect("/announcements");
};