// Caleb Beardall
const router = require('express').Router();
const rsvpsController = require('../controllers/rsvps');
const { ensureAuth } = require('../middleware/auth');

router.get('/', rsvpsController.getAll);

router.get('/:id', rsvpsController.getOne);

router.post('/', ensureAuth, rsvpsController.createOne);

router.put('/:id', ensureAuth, rsvpsController.updateOne);

router.delete('/:id', ensureAuth, rsvpsController.deleteOne);

module.exports = router;