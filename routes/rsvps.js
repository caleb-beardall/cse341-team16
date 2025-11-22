const router = require('express').Router();
const rsvpsController = require('../controllers/rsvps');

router.get('/events/:eventId/rsvps', rsvpsController.getAllForEvent);

router.get('/events/:eventId/rsvps/:id', rsvpsController.getOneForEvent);

router.post('/events/:eventId/rsvps', rsvpsController.createForEvent);

router.put('/events/:eventId/rsvps/:id', rsvpsController.updateForEvent);

router.delete('/events/:eventId/rsvps/:id', rsvpsController.deleteForEvent);

module.exports = router;