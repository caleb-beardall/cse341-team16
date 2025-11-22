// Caleb Beardall
const Event = require('../models/event');

const getAll = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).send(events);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const getOne = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).send({ message: 'Event not found' });
        res.status(200).send(event);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const createOne = async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).send(event);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

const updateOne = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } 
        );
        if (!event) return res.status(404).send({ message: 'Event not found' });
        res.status(200).send(event);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

const deleteOne = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).send({ message: 'Event not found' });
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