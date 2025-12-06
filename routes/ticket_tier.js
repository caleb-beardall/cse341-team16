const router = require('express').Router();
const ticketTier = require('../controllers/ticket_tier');
const { ensureAuth } = require('../middleware/auth');
const { createTierValidator, updateTierValidator } = require('../helpers/validateTicketTier');

router.get('/', ticketTier.getAll);
router.get('/:id', ticketTier.getOne);
router.get('/event/:eventId', ticketTier.getByEvent);
router.post('/', ensureAuth, createTierValidator, ticketTier.create);
router.put('/:tierId', ensureAuth, updateTierValidator, ticketTier.update);
router.delete('/:tierId', ensureAuth, ticketTier.remove);

module.exports = router;

