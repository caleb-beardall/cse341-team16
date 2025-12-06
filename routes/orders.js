const router = require("express").Router();
const orders = require("../controllers/orders");
const { ensureAuth } = require('../middleware/auth');
const {
    createOrderValidator,
    confirmPaymentValidator,
    getMyOrdersValidator,
} = require("../helpers/validateOrders");

router.get("/:userId", getMyOrdersValidator, orders.getMyOrders);
router.post("/", ensureAuth, createOrderValidator, orders.createOrder);
router.post("/:orderId/pay", ensureAuth, confirmPaymentValidator, orders.confirmPayment);
router.delete("/:orderId", ensureAuth, orders.deleteOrder);

module.exports = router;