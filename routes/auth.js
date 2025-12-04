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

// logout
router.get('/logout', (req, res, next) => {  
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    // destroy the session so req.isAuthenticated() becomes false
    if (req.session) {
      req.session.destroy(() => {
        res.send('You have been logged out from the app.');
      });
    } else {
      res.send('You have been logged out from the app.');
    }
  });
});

// Failure route for testing
router.get('/failure', (req, res) => {
    res.send('Google Authentication Failed.');
});

// Success route for testing
router.get('/success', (req, res) => {
    res.send('Google Authentication Successful.');
});

module.exports = router;