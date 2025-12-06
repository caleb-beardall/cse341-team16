const router = require("express").Router();
const orders = require("../controllers/orders");
const {
    createOrderValidator,
    confirmPaymentValidator,
    getMyOrdersValidator,
} = require("../helpers/validateOrders");

router.get("/:userId", getMyOrdersValidator, orders.getMyOrders);
router.post("/", createOrderValidator, orders.createOrder);
router.post("/:orderId/pay", confirmPaymentValidator, orders.confirmPayment);
router.delete("/:orderId", orders.deleteOrder);

module.exports = router;