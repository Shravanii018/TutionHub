const Note = require("../models/note.js");
const cloudinary = require("cloudinary").v2;

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

// upload buffer to cloudinary
const uploadToCloudinary = (buffer, mimetype) => {
    return new Promise((resolve, reject) => {
        // determine resource type based on mimetype
        // const resourceType = mimetype === "application/pdf" ? "image" : "auto";
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                upload_preset: "tuitionhub_preset",
                resource_type: "auto",
            },
            (error, result) => {
                if (error) {
                    console.log("Cloudinary error:", error);
                    reject(error);
                } else {
                    console.log("Cloudinary success:", result.secure_url);
                    resolve(result);
                }
            }
        );
        // pipe buffer into stream
        const { Readable } = require("stream");
        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);
        readable.pipe(uploadStream);
    });
};

module.exports.createContent = async (req, res) => {
    const newNote = new Note(req.body.note);
    newNote.uploadedBy = req.user._id;

    if (req.file) {
        try {
            const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
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