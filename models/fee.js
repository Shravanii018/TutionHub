const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feeSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    month: {
        type: String,       // e.g. "June 2025"
        required: true,
    },
    paid: {
        type: Boolean,
        default: false,
    },
    paidOn: {
        type: Date,
    },
    remark: {
        type: String,
    },
});

module.exports = mongoose.model("Fee", feeSchema);