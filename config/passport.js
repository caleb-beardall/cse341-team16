// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');

// load env vars
dotenv.config();

// load User model (now that it exists)
let User;
try {
  User = require('../models/user');
} catch (err) {
  console.warn(
    'User model not found yet. Remember to create models/user.js for OAuth users.'
  );
}

// configure Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!User) {
          // if the User model doesn't exist yet, then I just return a small temp profile
          return done(null, {
            id: profile.id,
            displayName: profile.displayName,
            emails: profile.emails,
          });
        }

        // find the existing user by Google ID and ...
        let user = await User.findOne({ googleId: profile.id });

        // if not found, create a new one
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email:
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : null,
            avatar:
              profile.photos && profile.photos[0]
                ? profile.photos[0].value
                : null,
          });
        }

        return done(null, user);
      } catch (err) {
        console.error('Error in GoogleStrategy verify callback:', err);
        return done(err, null);
      }
    }
  )
);

// Store the user in the session
passport.serializeUser((user, done) => {
  if (user && user.id) {
    return done(null, user.id);
  }
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  try {
    if (!User) {
      return done(null, { id });
    }

    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    console.error('Error in deserializeUser:', err);
    done(err, null);
  }
});

module.exports = passport;