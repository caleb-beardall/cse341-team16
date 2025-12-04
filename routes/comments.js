// Christian Martinez
const router = require('express').Router();
const commentsController = require('../controllers/comments');

router.get('/', commentsController.getAllComments);
router.get('/:id', commentsController.getSingleComment);
router.post('/', commentsController.createComment);
router.put('/:id', commentsController.updateComment);
router.delete('/:id', commentsController.deleteComment);


module.exports = router;