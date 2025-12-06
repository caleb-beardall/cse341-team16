const { body, param, query, validationResult } = require("express-validator");
const TicketTier = require("../models/ticket_tier");

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

const allowedStatus = ["pending", "paid", "cancelled"];

const validateStock = async (items) => {
  const errors = [];
  const tierDetails = [];

  for (const item of items) {
    const tier = await TicketTier.findById(item.tierId);

    if (!tier) {
      errors.push(`Ticket tier ${item.tierId} not found`);
      continue;
    }

    if (!tier.is_active) {
      errors.push(`Ticket tier "${tier.name}" is not available for sale`);
      continue;
    }

    const now = new Date();
    if (now < tier.sales_start) {
      errors.push(`Sales for "${tier.name}" have not started yet`);
      continue;
    }

    if (now > tier.sales_end) {
      errors.push(`Sales for "${tier.name}" have ended`);
      continue;
    }

    const available = tier.capacity - tier.sold - tier.reserved;
    if (item.quantity > available) {
      errors.push(
        `Not enough stock for "${tier.name}". Available: ${available}, Requested: ${item.quantity}`
      );
      continue;
    }

    if (item.quantity > tier.max_per_order) {
      errors.push(
        `Maximum ${tier.max_per_order} tickets per order for "${tier.name}"`
      );
      continue;
    }

    tierDetails.push({
      tier,
      quantity: item.quantity,
    });
  }

  return { errors, tierDetails };
};

const createOrderValidator = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID format"),
  body("eventId")
    .notEmpty()
    .withMessage("Event ID is required")
    .isMongoId()
    .withMessage("Invalid Event ID format"),

  body("items")
    .isArray({ min: 1 })
    .withMessage("Items must be an array with at least one item"),

  body("items.*.tierId")
    .notEmpty()
    .withMessage("Tier ID is required for each item")
    .isMongoId()
    .withMessage("Invalid Tier ID format"),

  body("items.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required for each item")
    .isInt({ min: 1, max: 20 })
    .withMessage("Quantity must be between 1 and 20"),

  validate,
];

const confirmPaymentValidator = [
  param("orderId")
    .notEmpty()
    .withMessage("Order ID is required")
    .isMongoId()
    .withMessage("Invalid Order ID format"),

  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID format"),

  body("payment_id")
    .notEmpty()
    .withMessage("Payment ID is required")
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Payment ID must be between 5 and 100 characters"),

  body("holder_info")
    .optional()
    .isObject()
    .withMessage("Holder info must be an object"),

  body("holder_info.name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Holder name must be between 2 and 100 characters"),

  body("holder_info.email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid holder email format"),

  body("holder_info.identification_number")
    .optional()
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage("Identification number must be between 5 and 20 characters"),

  validate,
];

const getMyOrdersValidator = [
  query("status")
    .optional()
    .isIn(allowedStatus)
    .withMessage(`Status must be one of: ${allowedStatus.join(", ")}`),

  query("sort")
    .optional()
    .isIn(["createdAt", "total_amount", "status"])
    .withMessage("Invalid sort field"),

  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order must be 'asc' or 'desc'"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  validate,
];

module.exports = {
  createOrderValidator,
  confirmPaymentValidator,
  getMyOrdersValidator,
  validateStock,
};
