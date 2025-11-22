const router = require('express').Router();
const commentsController = require('../controllers/comments');

router.get('/events/:eventId/comments', commentsController.getAllForEvent);

router.get('/events/:eventId/comments/:id', commentsController.getOneForEvent);

router.post('/events/:eventId/comments', commentsController.createForEvent);

router.put('/events/:eventId/comments/:id', commentsController.updateForEvent);

router.delete('/events/:eventId/comments/:id', commentsController.deleteForEvent);

module.exports = router;