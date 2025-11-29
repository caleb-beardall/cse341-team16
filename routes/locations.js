// routes/locations.js - Rick Shaw

const router = require('express').Router();

const locationsController = require('../controllers/locations');

//get locations
router.get('/', locationsController.getAll);

// get locations by ID
router.get('/:id', locationsController.getOne);

// post a new location
router.post('/', locationsController.createOne);

// modify an existing location by ID
router.put('/:id', locationsController.updateOne);

// delete a location by ID
router.delete('/:id', locationsController.deleteOne);

module.exports = router;