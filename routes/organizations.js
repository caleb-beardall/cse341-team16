//created for sergio
const router = require('express').Router();
const organizationsController = require('../controllers/organizations');
const { ensureAuth } = require('../middleware/auth'); 


// GET /organizations
router.get('/', organizationsController.getAll);

// GET /organizations/:id
router.get('/:id', organizationsController.getOne);

// POST /organizations
router.post('/', ensureAuth, organizationsController.createOne);

// PUT /organizations/:id
router.put('/:id', ensureAuth, organizationsController.updateOne);

// DELETE /organizations/:id
router.delete('/:id', ensureAuth, organizationsController.deleteOne);

module.exports = router;
