// Caleb Beardall
const router = require('express').Router();
const eventsController = require('../controllers/events');
const { ensureAuth } = require('../middleware/auth');

router.get('/', eventsController.getAll);

router.get('/:id', eventsController.getOne);

router.post('/', ensureAuth, eventsController.createOne);

router.put('/:id', ensureAuth, eventsController.updateOne);

router.delete('/:id', ensureAuth, eventsController.deleteOne);

module.exports = router;