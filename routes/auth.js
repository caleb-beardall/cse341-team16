const router = require('express').Router();
const passport = require('passport');

// *** OAuth login with Google ***

// Route to initiate the Google OAuth login
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/failure',
        successRedirect: '/auth/success',
    })
);

// Failure route for testing
router.get('/failure', (req, res) => {
    res.send('Google Authentication Failed.');
});

// Success route for testing
router.get('/success', (req, res) => {
    res.send('Google Authentication Successful.');
});

module.exports = router;