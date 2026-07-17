const Joi = require("joi");

// ===== studentSchema =====
// validates form data when teacher adds or edits a student
module.exports.studentSchema = Joi.object({
    student: Joi.object({
        fullName: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().allow("", null),
        password: Joi.string().allow("", null),   // optional on edit, required on create (handled in controller)
    }).required()
});

// ===== feeSchema =====
// validates form data when teacher adds a fee record
module.exports.feeSchema = Joi.object({
    fee: Joi.object({
        student: Joi.string().required(),          // student ObjectId as string
        month: Joi.string().required(),
        amount: Joi.number().required().min(0),
        remark: Joi.string().allow("", null),
    }).required()
});

// ===== noteSchema =====
// validates form data when teacher uploads a note or PDF
module.exports.noteSchema = Joi.object({
    note: Joi.object({
        title: Joi.string().required(),
        subject: Joi.string().required(),
        type: Joi.string().valid("note", "pdf", "assignment").required(),
        file: Joi.any().optional(),                // file handled separately by multer
    }).required()
});

// ===== announcementSchema =====
// validates form data when teacher posts an announcement
module.exports.announcementSchema = Joi.object({
    announcement: Joi.object({
        title: Joi.string().required(),
        message: Joi.string().required(),
    }).required()
});