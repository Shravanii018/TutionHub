const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["note", "pdf", "assignment"],   // teacher can upload all three
        required: true,
    },
    file: {
        filename: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Note", noteSchema);