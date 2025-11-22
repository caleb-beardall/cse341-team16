const router = require('express').Router();
const eventsController = require('../controllers/events');

router.get('/', eventsController.getAll);

router.get('/:id', eventsController.getOne);

router.post('/', eventsController.createOne);

router.put('/:id', eventsController.updateOne);

router.delete('/:id', eventsController.deleteOne);

module.exports = router;