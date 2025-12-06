const mongoose = require("mongoose");
const Order = require("../models/orders");
const TicketTier = require("../models/ticket_tier");
const Ticket = require("../models/tickets");
const crypto = require("crypto");
const { validateStock } = require("../helpers/validateOrders");

const generateQRHash = () => {
  return crypto.randomBytes(16).toString("hex");
};

const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, eventId, items, holder_info } = req.body;
    const { errors, tierDetails } = await validateStock(items);

    if (errors.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Validation errors", errors });
    }

    const eventIds = tierDetails.map((td) => td.tier.eventId.toString());
    const uniqueEventIds = [...new Set(eventIds)];
    if (uniqueEventIds.length > 1 || uniqueEventIds[0] !== eventId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "All items must belong to the same event as eventId",
      });
    }

    let totalAmount = 0;

    const orderItems = tierDetails.map(({ tier, quantity }) => {
      const subtotal = tier.price * quantity;
      totalAmount += subtotal;
      return {
        tierId: tier._id,
        quantity,
        unit_price: tier.price,
      };
    });

    for (const { tier, quantity } of tierDetails) {
      await TicketTier.findByIdAndUpdate(
        tier._id,
        { $inc: { reserved: quantity } },
        { session }
      );
    }

    const order = new Order({
      userId,
      eventId,
      items: orderItems,
      total_amount: totalAmount,
      status: "pending",
    });

    await order.save({ session });
    await session.commitTransaction();

    res
      .status(201)
      .json({ message: "Order created successfully", data: order });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  } finally {
    session.endSession();
  }
};

const confirmPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const { userId, payment_id, holder_info } = req.body;
    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.status === "paid" || order.status === "cancelled") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: `Order already ${order.status}` });
    }

    order.status = "paid";
    order.payment_id = payment_id;
    order.purchase_date = new Date();
    await order.save({ session });

    for (const item of order.items) {
      await TicketTier.findByIdAndUpdate(
        item.tierId,
        { $inc: { sold: item.quantity, reserved: -item.quantity } },
        { session }
      );
    }

    const tickets = [];
    for (const item of order.items) {
      for (let i = 0; i < item.quantity; i++) {
        const ticket = new Ticket({
          eventId: order.eventId,
          userId: order.userId,
          holder_info: {
            name: holder_info.name || "Pending",
            email: holder_info.email || "Pending@gmail.com",
            identification_number:
              holder_info.identification_number || "Pending",
          },
          status: "active",
          qr_hash: generateQRHash(),
        });
        await ticket.save({ session });
        tickets.push(ticket);
      }
    }
    await session.commitTransaction();
    res.status(200).json({
      message: "Payment confirmed and tickets issued",
      data: { order, tickets },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  } finally {
    session.endSession();
  }
};

const getMyOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      status,
      sort = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { userId };
    if (status) {
      filter.status = status;
    }

    const pageNumbers = parseInt(page);
    const limitNumbers = parseInt(limit);
    const skip = (pageNumbers - 1) * limitNumbers;
    const sortOrder = order === "desc" ? -1 : 1;
    const sortObject = { [sort]: sortOrder };

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort(sortObject)
        .skip(skip)
        .limit(limitNumbers),
      Order.countDocuments(filter),
    ]);
    res.status(200).json({
      data: orders,
      total,
      page: pageNumbers,
      pages: Math.ceil(total / limitNumbers),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  createOrder,
  confirmPayment,
  getMyOrders,
  deleteOrder,
};
