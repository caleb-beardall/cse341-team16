// Percy Yarleque - Orders Controller
const Order = require('../models/orders');
const Ticket = require('../models/tickets');
const TicketTier = require('../models/ticket_tier');
const crypto = require('crypto');
// const validateOrderInput = require('../helpers/validateOrderInput'); // Optional validation helper

// Create a new Order 
const createOrder = async (req, res) => {
    try {
        // NOTE: In a real system, stock reservation and price validation must happen here.
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).send(savedOrder);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

// 2Process Payment for an Order
const processPayment = async (req, res) => {
    const orderId = req.params.id;
    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).send({ message: 'Order not found.' });
        if (order.status !== 'pending') return res.status(400).send({ message: `Cannot process payment for order status: ${order.status}.` });

        // Update order status
        order.status = 'paid';
        order.payment_id = req.body.payment_id || `MOCK_PAYMENT_${Date.now()}`;
        order.purchase_date = new Date();
        await order.save();

        // Generate Tickets for each Order Item
        const ticketsGenerated = [];
        for (const item of order.items) {
            const tier = await TicketTier.findById(item.tierId);
            if (!tier) continue; 

            for (let i = 0; i < item.quantity; i++) {
                const qr_hash = crypto.randomBytes(20).toString('hex'); // Generate unique QR hash
                
                const holderInfo = req.body.holder_info || {
                    name: `Holder for ${order.userId}`,
                    email: `user_${order.userId}@example.com`,
                    identification_number: `ID-${Date.now()}`
                };

                const newTicket = new Ticket({
                    eventId: order.eventId,
                    userId: order.userId,
                    holder_info: holderInfo,
                    qr_hash: qr_hash,
                });
                await newTicket.save();
                ticketsGenerated.push(newTicket);
                
                // Update sold count on the TicketTier
                await TicketTier.updateOne({ _id: item.tierId }, { $inc: { sold: 1 } });
            }
        }

        res.status(200).send({
            message: 'Payment processed and tickets generated.',
            order: order,
            tickets: ticketsGenerated
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

// Get Order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.tierId');
        if (!order) return res.status(404).send({ message: 'Order not found' });
        res.status(200).send(order);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

// cancel an Order
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).send({ message: 'Order not found' });
        if (order.status === 'paid') return res.status(400).send({ message: 'Cannot cancel a paid order.' });
        if (order.status === 'cancelled') return res.status(400).send({ message: 'Order is already cancelled.' });

        order.status = 'cancelled';
        await order.save();

        res.status(200).send({ message: 'Order cancelled successfully', order });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

// Get Orders by User ID
const getOrdersByUserId = async (req, res) => {
    try {
        if (!req.query.userId) return res.status(400).send({ message: 'userId query parameter is required.' });
        const orders = await Order.find({ userId: req.query.userId }).sort({ purchase_date: -1 });
        res.status(200).send(orders);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

module.exports = {
    createOrder,
    processPayment,
    getOrderById,
    cancelOrder,
    getOrdersByUserId,
};