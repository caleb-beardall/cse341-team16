const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    res.send('Hello World');
});

// Auth
router.use('/auth', require('./auth'));

// Users
// router.use('/users', require('./users'));

// Events
router.use('/events', require('./events'));

// Organizations.. added for sergio...
router.use('/organizations', require('./organizations'));

// Locations
router.use('/locations', require('./locations'));

// Comments
router.use('/comments', require('./comments'));

// Ticket Tiers
router.use('/ticket_tier', require('./ticket_tier'));
// Tickets

module.exports = router;