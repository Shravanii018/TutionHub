const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isTeacher, validateFee } = require("../middleware.js");
const feesController = require("../controllers/fees.js");

// index — teacher sees all fees, student sees own fees
router.route("/")
    .get(isLoggedIn, wrapAsync(feesController.index))
    .post(isLoggedIn, isTeacher, validateFee, wrapAsync(feesController.createFee));

// New Route
router.get("/new", isLoggedIn, isTeacher, wrapAsync(feesController.renderNewForm));

// mark fee as paid
router.put("/:id/paid", isLoggedIn, isTeacher, wrapAsync(feesController.markPaid));

// delete fee record
router.delete("/:id", isLoggedIn, isTeacher, wrapAsync(feesController.destroyFee));

module.exports = router;