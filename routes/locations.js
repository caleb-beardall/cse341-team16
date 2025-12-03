// routes/locations.js - Rick Shaw

const router = require('express').Router();
const locationsController = require('../controllers/locations');

// OAuth protection
const { ensureAuth } = require('../middleware/auth');

// **** Unprotected routes ****

// Get all locations
router.get('/', locationsController.getAll);

// Get a single location by ID
router.get('/:id', locationsController.getOne);

// **** Protected routes ****

// Create a new location
router.post('/', ensureAuth, locationsController.createOne);

// Update an existing location by ID
router.put('/:id', ensureAuth, locationsController.updateOne);

// Delete a location by ID
router.delete('/:id', ensureAuth, locationsController.deleteOne);

module.exports = router;