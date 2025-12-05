// Christian Martinez
const router = require('express').Router();
const commentsController = require('../controllers/comments');
const { ensureAuth } = require('../middleware/auth');

router.get('/', commentsController.getAllComments);
router.get('/:id', commentsController.getSingleComment);
router.post('/', ensureAuth, commentsController.createComment);
router.put('/:id', ensureAuth, commentsController.updateComment);
router.delete('/:id', ensureAuth, commentsController.deleteComment);


module.exports = router;