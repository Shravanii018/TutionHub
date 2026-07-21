const Note = require("../models/note.js");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

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
            const filename = Date.now() + "-" + req.file.originalname;

            // upload to supabase storage
            const { data, error } = await supabase.storage
                .from("tuitionhub-files")
                .upload(filename, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false,
                });

            if (error) {
                console.log("Supabase upload error:", error.message);
                req.flash("error", "File upload failed: " + error.message);
                return res.redirect("/content/new");
            }

            // get public URL
            const { data: urlData } = supabase.storage
                .from("tuitionhub-files")
                .getPublicUrl(filename);

            console.log("Supabase upload success:", urlData.publicUrl);
            newNote.file = {
                filename: req.file.originalname,
                url: urlData.publicUrl,
            };
        } catch (err) {
            console.log("Upload error:", err.message);
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