const Note = require("../models/note.js");
const FormData = require("form-data");

// show all uploaded notes and PDFs
module.exports.index = async (req, res) => {
    const allNotes = await Note.find({}).populate("uploadedBy");
    res.render("content/index.ejs", { allNotes });
};

// show single note/pdf
module.exports.show = async (req, res) => {
    let { id } = req.params;
    const note = await Note.findById(id).populate("uploadedBy");
    if (!note) {
        req.flash("error", "Content not found!");
        return res.redirect("/content");
    }
    res.render("content/show.ejs", { note });
};

// render upload form (teacher only)
module.exports.renderNewForm = (req, res) => {
    res.render("content/new.ejs");
};

// upload to cloudinary using unsigned upload (no API secret needed)
const uploadToCloudinary = async (buffer, filename) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = "tuitionhub_preset";

    const formData = new FormData();
    formData.append("file", buffer, { filename, contentType: "application/pdf" });
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "tuitionhub");

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
            method: "POST",
            body: formData,
            headers: formData.getHeaders(),
        }
    );

    const data = await response.json();
    console.log("Cloudinary response:", JSON.stringify(data));

    if (data.error) {
        throw new Error(data.error.message);
    }

    return data;
};

module.exports.createContent = async (req, res) => {
    const newNote = new Note(req.body.note);
    newNote.uploadedBy = req.user._id;

    if (req.file) {
        try {
            const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
            newNote.file = {
                filename: req.file.originalname,
                url: result.secure_url,
            };
        } catch (err) {
            console.log("Upload failed:", err.message);
            req.flash("error", "File upload failed: " + err.message);
            return res.redirect("/content/new");
        }
    }

    await newNote.save();
    req.flash("success", "Content uploaded successfully!");
    res.redirect("/content");
};

// delete note/PDF (teacher only)
module.exports.destroyContent = async (req, res) => {
    let { id } = req.params;
    await Note.findByIdAndDelete(id);
    req.flash("success", "Content deleted successfully!");
    res.redirect("/content");
};