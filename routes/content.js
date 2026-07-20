const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isTeacher, validateNote } = require("../middleware.js");
const contentController = require("../controllers/content.js");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// store uploads directly on cloudinary as raw files (PDFs)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: "tuitionhub",
            resource_type: "raw",
            public_id: Date.now() + "-" + file.originalname.replace(/\.[^/.]+$/, ""), // remove extension for public_id
        };
    },
});

const upload = multer({ storage });

router.route("/")
    .get(isLoggedIn, wrapAsync(contentController.index))
    .post(isLoggedIn, isTeacher, upload.single("note[file]"), validateNote, wrapAsync(contentController.createContent));

router.get("/new", isLoggedIn, isTeacher, contentController.renderNewForm);

router.route("/:id")
    .get(isLoggedIn, wrapAsync(contentController.show))
    .delete(isLoggedIn, isTeacher, wrapAsync(contentController.destroyContent));

module.exports = router;