// Percy Yarleque - Ticket Validation Helpers

const { body, param, query, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      msg: "Validation error",
      errors: errors.array(),
    });
  }
  next();
};

const allowedStatus = ["active", "cancelled", "used"];

const myTicketsValidator = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID format"),
  query("is_active")
    .optional()
    .isIn(["true", "false"])
    .withMessage("is_active must be 'true' or 'false'"),

  query("status")
    .optional()
    .isIn(allowedStatus)
    .withMessage(`status must be one of: ${allowedStatus.join(", ")}`),

  query("sort")
    .optional()
    .isIn(["createdAt", "status", "eventId"])
    .withMessage("Invalid sort field"),

  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("order must be 'asc' or 'desc'"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100"),

  validate,
];

const getTicketDetailsValidator = [
  param("ticketId")
    .notEmpty()
    .withMessage("Ticket ID is required")
    .isMongoId()
    .withMessage("Invalid Ticket ID format"),
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID format"),
  validate,
];

const updateNominatedHolderValidator = [
  param("ticketId")
    .notEmpty()
    .withMessage("Ticket ID is required")
    .isMongoId()
    .withMessage("Invalid Ticket ID format"),
  body("name")
    .notEmpty()
    .withMessage("Holder name is required")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("identification_number")
    .notEmpty()
    .withMessage("Identification Number is required")
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage("Identification Number must be between 5 and 20 characters"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  validate,
];

const getAllTicketsValidator = [
  query("is_active")
    .optional()
    .isIn(["true", "false"])
    .withMessage("is_active must be 'true' or 'false'"),

  query("status")
    .optional()
    .isIn(allowedStatus)
    .withMessage(`status must be one of: ${allowedStatus.join(", ")}`),

  query("eventId")
    .optional()
    .isMongoId()
    .withMessage("eventId must be a valid MongoDB ID"),

  query("sort")
    .optional()
    .isIn(["createdAt", "status", "eventId", "userId"])
    .withMessage("Invalid sort field"),

  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("order must be 'asc' or 'desc'"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100"),

  validate,
];

const cancelTicketValidator = [
  param("id")
    .notEmpty()
    .withMessage("Ticket ID is required")
    .isMongoId()
    .withMessage("Invalid Ticket ID format"),

  validate,
];

const validateTicketForEntryValidator = [
  body("ticketCode")
    .notEmpty()
    .withMessage("Ticket code is required")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Ticket code is too short"),

  validate,
];

const validateTicketForEntryLogic = (ticket) => {
  const errors = [];

  if (!ticket) {
    errors.push("Ticket not found");
    return { valid: false, errors };
  }

  if (ticket.status === "cancelled") {
    errors.push("Ticket has been cancelled");
  }

  if (ticket.status === "used") {
    errors.push("Ticket has already been used");
  }

  if (ticket.ticket_tier && ticket.ticket_tier.is_active === false) {
    errors.push("Ticket tier is no longer active");
  }

  if (ticket.eventId && ticket.eventId.date < new Date()) {
    errors.push("Event has already ended");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

module.exports = {
  myTicketsValidator,
  getTicketDetailsValidator,
  updateNominatedHolderValidator,
  getAllTicketsValidator,
  cancelTicketValidator,
  validateTicketForEntryValidator,
  validateTicketForEntryLogic,
};