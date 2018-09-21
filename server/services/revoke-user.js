const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const config = require('../../config');
const express = require('express');

const router = new express.Router();
/**
 *  Revoke user token function
 */
revokeUserToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];
  const socketId = req.body.socketId;

  // decode the token using a secret key-phrase
  return jwt.verify(token, config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }

    const userId = decoded.sub;

    // check if a user exists
    return User.findById(userId, (userErr, user) => {
        // If nothing went wrong til now update socket id
        user.socketId = socketId;
        user.save((error) => {
            if (error) return done(error);
        });

        if (userErr || !user) {
            return res.status(401).end();
        }

      return next();
    });
  });
};

router.post('/revoke-user', (req, res, next) => {
    return revokeUserToken((username) => {
        res.status(200).json({
          name: username,
        });
    })(req, res, next);
});
