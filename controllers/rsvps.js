// Caleb Beardall
const Rsvp = require('../models/rsvp');
const validateRsvpInput = require('../helpers/validateRsvpInput');

const getAll = async (req, res) => {
    //#swagger.tags=['RSVPs']
    try {
        const rsvps = await Rsvp.find();
        res.status(200).send(rsvps);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const getOne = async (req, res) => {
    //#swagger.tags=['RSVPs']
    try {
        const rsvp = await Rsvp.findById(req.params.id);
        if (!rsvp) return res.status(404).send({ message: 'RSVP not found' });
        res.status(200).send(rsvp);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const createOne = async (req, res) => {
    //#swagger.tags=['RSVPs']
    const { isValid, errors } = validateRsvpInput(req.body);
    if (!isValid) return res.status(400).send({ errors });

    try {
        const newRsvp = {
            userId: req.body.userId.trim(),
            eventId: req.body.eventId.trim(),
            status: req.body.status.trim()
        };

        const rsvp = await Rsvp.create(newRsvp);
        res.status(201).send(rsvp);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

const updateOne = async (req, res) => {
    //#swagger.tags=['RSVPs']
    const { isValid, errors } = validateRsvpInput(req.body);
    if (!isValid) return res.status(400).send({ errors });

    try {
        const updatedRsvp = {
            userId: req.body.userId?.trim(),
            eventId: req.body.eventId?.trim(),
            status: req.body.status?.trim()
        };

        const rsvp = await Rsvp.findByIdAndUpdate(
            req.params.id,
            updatedRsvp,
            { new: true }
        );

        if (!rsvp) return res.status(404).send({ message: 'RSVP not found' });

        res.status(200).send(rsvp);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

const deleteOne = async (req, res) => {
    //#swagger.tags=['RSVPs']
    try {
        const rsvp = await Rsvp.findByIdAndDelete(req.params.id);
        if (!rsvp) return res.status(404).send({ message: 'RSVP not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

module.exports = {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne
};