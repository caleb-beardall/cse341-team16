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

// Organizations
// router.use('/organizations', require('./organizations'));

// RSVPs
router.use('/', require('./rsvps'));

// Comments
// router.use('/', require('./comments'));

module.exports = router;