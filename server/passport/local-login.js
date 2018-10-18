const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;
const config = require('../../config');
const crypto = require('crypto');

/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const userData = {
    email: email.trim(),
    password: password.trim(),
    socketId: req.body.socketId
  };

  // find a user by email address
  return User.findOne({ email: userData.email }, (err, user) => {
    if (err) { return done(err); }

    if (!user) {
      const error = new Error('Incorrect email or password');
      error.name = 'IncorrectCredentialsError';

      return done(error);
    }

    // check if a hashed user's password is equal to a value saved in the database
    return user.comparePassword(userData.password, (passwordErr, isMatch) => {
      if (err) { return done(err); }

      if (!isMatch) {
        const error = new Error('Incorrect email or password');
        error.name = 'IncorrectCredentialsError';

        return done(error);
      }

      // If nothing went wrong til now update socketId and online status
      user.socketId = userData.socketId;

      // If nothing went wrong til now update online status
      user.online = true;

      const payload = {
        sub: user._id,
        admin: user.isAdmin,
        exp: Math.floor(Date.now() / 1000) + (30)
      };

      // Create a refresh token
      const refreshToken = (user._id).toString() + '.' + crypto.randomBytes(40).toString('hex');

      //store refreshToken
      user.refreshToken = refreshToken;

      user.save((error) => {
          if (error) return done(error);
      });

      // Create an access token
      const token = jwt.sign(payload, config.jwtSecret);
      const data = {
        name: user.name,
        refreshToken: refreshToken
      };

      return done(null, token, data);
    });
  });
});
