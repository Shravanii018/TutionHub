const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default || require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,       // optional — not required
    },
    role: {
        type: String,
        enum: ["teacher", "student"],
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);