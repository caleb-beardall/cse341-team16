// Percy Yarleque - Tickets Controller
const Ticket = require('../models/tickets');

// Get Tickets by User ID
const getTicketsByUserId = async (req, res) => {
    try {
        if (!req.query.userId) return res.status(400).send({ message: 'userId query parameter is required.' });
        const tickets = await Ticket.find({ userId: req.query.userId }).sort({ createdAt: -1 });
        res.status(200).send(tickets);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

// Get Ticket by QR Hash
const getTicketByHash = async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ qr_hash: req.params.qr_hash });
        if (!ticket) return res.status(404).send({ message: 'Ticket not found.' });
        res.status(200).send(ticket);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

// Check-in Ticket (Process Ticket Scanning)
const processCheckin = async (req, res) => {
    const ticketId = req.params.id;
    const { gate, staff_id } = req.body;
    
    try {
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) return res.status(404).send({ message: 'Ticket not found.' });

        if (ticket.status !== 'active') {
            return res.status(400).send({ 
                message: `Ticket already ${ticket.status}.`,
                history: ticket.checking_history
            });
        }

        // 1. Update status and register history
        ticket.status = 'used';
        ticket.checking_history.scanned_at = new Date();
        ticket.checking_history.gate = gate || 'DEFAULT_GATE';
        ticket.checking_history.staff_id = staff_id || 'DEFAULT_STAFF';

        await ticket.save();

        res.status(200).send({ 
            message: 'Check-in successful. Ticket status updated to USED.', 
            ticket: ticket 
        });

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};


module.exports = {
    getTicketsByUserId,
    getTicketByHash,
    processCheckin,
};