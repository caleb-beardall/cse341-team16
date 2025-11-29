// controllers/locations.js - Rick Shaw

const Location = require('../models/locations');

// GET all locations
const getAll = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).send(locations);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

// GET one location by ID
const getOne = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) return res.status(404).send({ message: 'Location not found' });
        res.status(200).send(location);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

// CREATE a location
const createOne = async (req, res) => {
    console.log('Incoming location body:', req.body); // debug log

    try {
        const newLocation = await Location.create({
            name: req.body.name?.trim(),
            type: req.body.type?.trim(),
            address: req.body.address?.trim(),
            city: req.body.city?.trim(),
            stateOrProvince: req.body.stateOrProvince?.trim(),
            country: req.body.country?.trim(),
            // NOTE: fixed typo: recommendedFor
            recommendedFor: req.body.recommendedFor || []
        });

        res.status(201).send(newLocation);
    } catch (err) {
        console.error('Error creating location:', err);
        res.status(400).send({ error: err.message });
    }
};

// UPDATE a location
const updateOne = async (req, res) => {
    try {
        const updatedLocation = await Location.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name?.trim(),
                type: req.body.type?.trim(),
                address: req.body.address?.trim(),
                city: req.body.city?.trim(),
                stateOrProvince: req.body.stateOrProvince?.trim(),
                country: req.body.country?.trim(),
                // NOTE: fixed typo: recommendedFor
                recommendedFor: req.body.recommendedFor || []
            },
            { new: true }
        );

        if (!updatedLocation) {
            return res.status(404).send({ message: 'Location not found' });
        }

        res.status(200).send(updatedLocation);
    } catch (err) {
        console.error('Error updating location:', err);
        res.status(400).send({ error: err.message });
    }
};

// DELETE a location
const deleteOne = async (req, res) => {
    try {
        const result = await Location.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).send({ message: 'Location not found' });
        res.sendStatus(204);
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
