// Caleb Beardall
const Comment = require('../models/comment');

const getAllForEvent = async (req, res) => {
    const { eventId } = req.params;
    try {
        const comments = await Comment.find({ eventId });
        res.status(200).send(comments);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const getOneForEvent = async (req, res) => {
    const { eventId, id } = req.params;
    try {
        const comment = await Comment.findOne({ _id: id, eventId });
        if (!comment) return res.status(404).send({ message: 'Comment not found' });
        res.status(200).send(comment);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const createForEvent = async (req, res) => {
    try {
        const comment = await Comment.create({
            ...req.body,
            eventId: req.params.eventId
        });
        res.status(201).send(comment);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

const updateForEvent = async (req, res) => {
    const { eventId, id } = req.params;
    try {
        const comment = await Comment.findOneAndUpdate(
            { _id: id, eventId },
            req.body,
            { new: true }
        );
        if (!comment) return res.status(404).send({ message: 'Comment not found' });
        res.status(200).send(comment);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

const deleteForEvent = async (req, res) => {
    const { eventId, id } = req.params;
    try {
        const comment = await Comment.findOneAndDelete({ _id: id, eventId });
        if (!comment) return res.status(404).send({ message: 'Comment not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

module.exports = {
    getAllForEvent,
    getOneForEvent,
    createForEvent,
    updateForEvent,
    deleteForEvent
}