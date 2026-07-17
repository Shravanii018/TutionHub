if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
console.log("API KEY IS:", process.env.GROQ_API_KEY);  // temporary debug line

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const userRouter = require("./routes/user.js");
const studentRouter = require("./routes/student.js");
const attendanceRouter = require("./routes/attendance.js");
const feeRouter = require("./routes/fee.js");
const contentRouter = require("./routes/content.js");
const announcementRouter = require("./routes/announcement.js");
const flashcardRouter = require("./routes/flashcard.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/tuitionhub";
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/tuitionhub";

main()
    .then(() => {
        console.log("connected to DB");
    }).catch(err => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "tuitionhubsupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// make flash messages and current user available in all views
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/setup-teacher", async (req, res) => {
    const User = require("./models/user.js");
    const teacher = new User({
        username: "deepali_maam",
        fullName: "Mrs. Deepali",
        email: "deepali.jagtap2012@gmail.com",
        phone: "9970300610",
        role: "teacher",
    });
    await User.register(teacher, "Avani@10");
    res.send("Teacher account created successfully!");
});


app.get("/", (req, res) => {
    res.redirect("/login");
});

app.use("/", userRouter);                          // login, signup, logout
app.use("/students", studentRouter);               // teacher manages students
app.use("/attendance", attendanceRouter);          // mark & view attendance
app.use("/fees", feeRouter);                       // track fee payments
app.use("/content", contentRouter);                // notes & PDF uploads
app.use("/announcements", announcementRouter);     // teacher announcements
app.use("/flashcards", flashcardRouter);           // AI flashcard generation

// 404 handler
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

// global error handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.render("error.ejs", { err });
});

app.listen(3000, () => {
    console.log("server is listening to port 3000");
});