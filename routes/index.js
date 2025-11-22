const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});

// Users
// router.use('/users', require('./users'));

// Events
router.use('/events', require('./events'));

// Organizations
// router.use('/organizations', require('./organizations'));

// Comments
router.use('/', require('./comments'));

// RSVPs
router.use('/', require('./rsvps'));

module.exports = router;