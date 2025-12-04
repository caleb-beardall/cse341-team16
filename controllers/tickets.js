// Percy Yarleque - Tickets Controller
const mongoose = require("mongoose");
const Ticket = require("../models/tickets");
const { validateTicketForEntryLogic } = require("../helpers/validateTicket");

const myTickets = async (req, res) => {
  try {
    const {userId} = req.params;
    const {
      is_active,
      status,
      sort = "createdAt",
      order = "asc",
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { userId: userId };
    if (is_active !== undefined) {
      filter.is_active = is_active === "true";
    }
    if (status) {
      filter.status = status;
    }
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const sortOrder = order === "desc" ? -1 : 1;
    const sortObject = { [sort]: sortOrder };
    const [tickets, total] = await Promise.all([
      Ticket.find(filter)
        .sort(sortObject)
        .skip(skip)
        .limit(limitNumber),
      Ticket.countDocuments(filter),
    ]);

    res.status(200).json({
      ok: true,
      data: tickets,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
    });
  } catch (err) {
    res
      .status(500)
      .json({ ok: false, msg: "Server error", error: err.message });
  }
};

const getTicketDetails = async (req, res) => {
  try {
    const {ticketId, userId} = req.params;

    const ticket = await Ticket.findOne({
      _id: ticketId,
      userId: userId,
    })

    if (!ticket) {
      return res
        .status(404)
        .json({ ok: false, msg: "Ticket not found for this user" });
    }

    res.status(200).json({ ok: true, data: ticket });
  } catch (err) {
    res
      .status(500)
      .json({ ok: false, msg: "Server error", error: err.message });
  }
};

const updateNominatedHolder = async (req, res) => {
  try {
    const {ticketId} = req.params;
    const { name, identification_number, email } = req.body;
    console.log(ticketId);
    const ticket = await Ticket.findOneAndUpdate(
      { _id: ticketId },
      {
        $set: {
          "holder_info.name": name,
          "holder_info.identification_number": identification_number,
          "holder_info.email": email,
        },
      },
      { new: true }
    );

    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, msg: "Ticket not found or not owned by user" });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const {
      is_active,
      status,
      eventId,
      sort,
      order = "asc",
      page = 1,
      limit = 10,
    } = req.query;
    const filter = {};
    if (is_active !== undefined) {
      filter.is_active = is_active === "true";
    }
    if (status) {
      filter.status = status;
    }
    if (eventId) {
      filter.eventId = eventId;
    }
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const sortOrder = order === "desc" ? -1 : 1;
    const sortObject = { [sort]: sortOrder };

    const [tickets, total] = await Promise.all([
      Ticket.find(filter)
        .sort(sortObject)
        .skip(skip)
        .limit(limitNumber),
      Ticket.countDocuments(filter),
    ]);

    res.status(200).json({
      ok: true,
      data: tickets,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
    });
  } catch (err) {
    res
      .status(500)
      .json({ ok: false, msg: "Server error", error: err.message });
  }
};

const cancelTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ ok: false, msg: "Ticket not found" });
    }

    if (ticket.status === "cancelled") {
      return res
        .status(400)
        .json({ ok: false, msg: "Ticket is already cancelled" });
    }

    ticket.status = "cancelled";
    await ticket.save();

    res.status(200).json({ ok: true, msg: "Ticket cancelled successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ ok: false, msg: "Server error", error: err.message });
  }
};

const validateTicketForEntry = async (req, res) => {
  try {
    const { ticketCode } = req.body;

    const ticket = await Ticket.findOne({ qr_hash: ticketCode });

    if (!ticket) {
      return res.status(404).json({ ok: false, msg: "Ticket not found" });
    }

    const validation = validateTicketForEntryLogic(ticket);
    if (!validation.valid) {
      return res.status(400).json({
        ok: false,
        msg: "Ticket is not valid for entry",
        errors: validation.errors,
      });
    }
    ticket.checking_history.scanned_at = new Date();
    ticket.checking_history.gate = "Main Gate";
    ticket.checking_history.staff_id = new mongoose.Types.ObjectId().toString();
    ticket.status = "used";
    await ticket.save();
    res
      .status(200)
      .json({ ok: true, msg: "Ticket is valid for entry", data: ticket });
  } catch (err) {
    res
      .status(500)
      .json({ ok: false, msg: "Server error", error: err.message });
  }
};

module.exports = {
  myTickets,
  getTicketDetails,
  updateNominatedHolder,
  getAllTickets,
  cancelTicket,
  validateTicketForEntry,
};
