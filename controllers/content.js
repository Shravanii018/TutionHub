const Note = require("../models/note.js");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports.index = async (req, res) => {
    const allNotes = await Note.find({}).populate("uploadedBy");
    res.render("content/index.ejs", { allNotes });
};

module.exports.show = async (req, res) => {
    let { id } = req.params;
    const note = await Note.findById(id).populate("uploadedBy");
    if (!note) {
        req.flash("error", "Content not found!");
        return res.redirect("/content");
    }
    res.render("content/show.ejs", { note });
};

module.exports.renderNewForm = (req, res) => {
    res.render("content/new.ejs");
};

module.exports.createContent = async (req, res) => {
    const newNote = new Note(req.body.note);
    newNote.uploadedBy = req.user._id;

    if (req.file) {
        try {
            // convert buffer to base64 data URI and upload
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;

            const result = await cloudinary.uploader.upload(dataURI, {
                folder: "tuitionhub",
                resource_type: "auto",
                use_filename: true,
                unique_filename: true,
            });

            console.log("Cloudinary success:", result.secure_url);
            newNote.file = {
                filename: req.file.originalname,
                url: result.secure_url,
            };
        } catch (err) {
            console.log("Cloudinary error:", err.message);
            req.flash("error", "File upload failed: " + err.message);
            return res.redirect("/content/new");
        }
    }

    await newNote.save();
    req.flash("success", "Content uploaded successfully!");
    res.redirect("/content");
};

module.exports.destroyContent = async (req, res) => {
    let { id } = req.params;
    await Note.findByIdAndDelete(id);
    req.flash("success", "Content deleted successfully!");
    res.redirect("/content");
};