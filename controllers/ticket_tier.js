// Percy Yarleque
const TicketTier = require("../models/ticket_tier");
const validateEventInput = require("../helpers/validateTicketTier");

const getAll = async (req, res) => {
  //Get all
  try {
    const {
      is_active,
      min_price,
      max_price,
      sort = "price",
      order = "asc",
      page = 1,
      limit = 10,
    } = req.query;
    const filter = {};
    if (is_active !== undefined) {
      filter.is_active = is_active === "true";
    }
    if (min_price || max_price) {
      filter.price = {};
      if (min_price) filter.price.$gte = Number(min_price);
      if (max_price) filter.price.$lte = Number(max_price);
    }
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const sortOrder = order === "desc" ? -1 : 1;
    const sortObject = { [sort]: sortOrder };
    const [tiers, total] = await Promise.all([
      TicketTier.find(filter).sort(sortObject).skip(skip).limit(limitNumber),
      TicketTier.countDocuments(filter),
    ]);
    res.status(200).send({
      data: tiers,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const getOne = async (req, res) => {
  //Get one
  try {
    const ticketTier = await TicketTier.findById(req.params.id);
    if (!ticketTier)
      return res.status(404).send({ message: "Ticket Tier not found" });
    res.status(200).send(ticketTier);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const getByEvent = async (req, res) => {
  //Get by Event
  try {
    const ticketTiers = await TicketTier.find({ eventId: req.params.eventId });
    res.status(200).send(ticketTiers);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const ticketTier = new TicketTier(req.body);
    await ticketTier.save();
    res.status(201).send(ticketTier);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const ticketTier = await TicketTier.findByIdAndUpdate(
      req.params.tierId,
      req.body,
      { new: true }
    );
    if (!ticketTier) {
      return res.status(404).send({ message: "Ticket Tier not found" });
    }
    res.status(200).send(ticketTier);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const remove = async (req, res) => {
  //Delete
  try {
    const ticketTier = await TicketTier.findByIdAndDelete(req.params.tierId);
    if (!ticketTier) {
      return res.status(404).send({ message: "Ticket Tier not found" });
    }
    res.status(200).send({ message: "Ticket Tier deleted successfully" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports = {
  getAll,
  getOne,
  getByEvent,
  create,
  update,
  remove,
};
