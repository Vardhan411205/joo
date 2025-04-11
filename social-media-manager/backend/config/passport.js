const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Configure Facebook Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'emails', 'name']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Handle Facebook auth
      done(null, profile);
    } catch (error) {
      done(error, null);
    }
  }));
}

// Configure Twitter Strategy
if (process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET) {
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_API_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL
  }, async (token, tokenSecret, profile, done) => {
    try {
      // Handle Twitter auth
      done(null, profile);
    } catch (error) {
      done(error, null);
    }
  }));
}

module.exports = passport; 