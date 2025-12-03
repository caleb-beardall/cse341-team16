const { body, param, validationResult } = require("express-validator");

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
const createTierValidator = [
  body("eventId")
    .notEmpty()
    .withMessage("EventId is required")
    .isMongoId()
    .withMessage("EEventId must be a valid MongoDB ID"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("The ticket name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("The name must be between 3 and 50 characters"),

  body("description")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("The description is too long (max 500 characters)"),

  body("price")
    .exists()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price cannot be negative"),

  body("currency")
    .optional()
    .isISO4217()
    .withMessage("Must be a valid currency code (e.g., USD, PEN, EUR)"),

  body("capacity")
    .exists()
    .withMessage("Capacity (stock) is required")
    .isInt({ min: 1 })
    .withMessage("Capacity must be an integer greater than 0"),

  body("max_per_order")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("The limit per order must be between 1 and 20"),

  body("sales_start")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid start date format"),

  body("sales_end")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid end date format")
    .custom((value, { req }) => {
      if (req.body.sales_start && value < req.body.sales_start) {
        throw new Error(
          "The sales end date cannot be earlier than the start date"
        );
      }
      return true;
    }),

  validate,
];

const updateTierValidator = [
  param("tierId").isMongoId().withMessage("Invalid Tier ID"),

  body("name").optional().trim().notEmpty().isLength({ min: 3 }),

  body("price").optional().isFloat({ min: 0 }),

  body("capacity").optional().isInt({ min: 1 }),

  validate,
];

module.exports = {
  createTierValidator,
  updateTierValidator,
};
