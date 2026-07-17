const ExpressError = require("./utils/ExpressError.js");
const { studentSchema, feeSchema, noteSchema, announcementSchema } = require("./schema.js");

// ===== isLoggedIn =====
// checks if user is logged in before accessing any protected route
// same as your Airbnb isLoggedIn — saves the redirect URL in session
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to access this page!");
        return res.redirect("/login");
    }
    next();
}

// ===== saveRedirectUrl =====
// moves redirectUrl from session into res.locals so passport doesn't clear it
// identical to your Airbnb saveRedirectUrl
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// ===== isTeacher =====
// checks if the logged-in user is a teacher
// TuitionHub's equivalent of isOwner in Airbnb — protects teacher-only routes
module.exports.isTeacher = (req, res, next) => {
    if (req.user.role !== "teacher") {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect("/announcements");
    }
    next();
}

// ===== validateStudent =====
// Joi validation for student form data — same pattern as validateListing in Airbnb
module.exports.validateStudent = (req, res, next) => {
    let { error } = studentSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// ===== validateFee =====
// Joi validation for fee form data
module.exports.validateFee = (req, res, next) => {
    let { error } = feeSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// ===== validateNote =====
// Joi validation for note/PDF upload form data
module.exports.validateNote = (req, res, next) => {
    let { error } = noteSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// ===== validateAnnouncement =====
// Joi validation for announcement form data
module.exports.validateAnnouncement = (req, res, next) => {
    let { error } = announcementSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}