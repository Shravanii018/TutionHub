const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, fullName, email, phone, password } = req.body;
        // role is always student on self-signup — teacher is created only via init/index.js
        const newUser = new User({ username, fullName, email, phone, role: "student" });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to TuitionHub!");
            res.redirect("/announcements");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to TuitionHub!");
    if (req.user.role === "teacher") {
        let redirectUrl = res.locals.redirectUrl || "/students";
        res.redirect(redirectUrl);
    } else {
        let redirectUrl = res.locals.redirectUrl || "/announcements";
        res.redirect(redirectUrl);
    }
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out. See you soon!");
        res.redirect("/login");
    });
};
