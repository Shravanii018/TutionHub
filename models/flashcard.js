const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const flashcardSchema = new Schema({
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note",           // linked to the PDF it was generated from
        required: true,
    },
    cards: [
        {
            question: {
                type: String,
                required: true,
            },
            answer: {
                type: String,
                required: true,
            },
        },
    ],
    generatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Flashcard", flashcardSchema);