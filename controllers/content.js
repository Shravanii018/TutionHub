const Note = require("../models/note.js");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

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

// upload to cloudinary using streamifier
const uploadToCloudinary = (buffer, filename) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "tuitionhub",
                resource_type: "auto",
                public_id: Date.now() + "-" + filename,
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

module.exports.createContent = async (req, res) => {
    const newNote = new Note(req.body.note);
    newNote.uploadedBy = req.user._id;

    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        newNote.file = {
            filename: req.file.originalname,
            url: result.secure_url,
        };
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