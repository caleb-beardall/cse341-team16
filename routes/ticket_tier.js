const router = require('express').Router();
const ticketTier = require('../controllers/ticket_tier');
const { createTierValidator, updateTierValidator } = require('../helpers/validateTicketTier');

router.get('/', ticketTier.getAll);
router.get('/:id', ticketTier.getOne);
router.get('/event/:eventId', ticketTier.getByEvent);
router.post('/', createTierValidator, ticketTier.create);
router.put('/:tierId', updateTierValidator, ticketTier.update);
router.delete('/:tierId', ticketTier.remove);

module.exports = router;

