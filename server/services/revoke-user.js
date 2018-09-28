const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const Services = require('mongoose').model('Services');
const config = require('../../config');

/**
 *  Revoke user token function
 */
module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];

  if (req.headers.host === config.host) {
    return Services.findOne({api_key: config.apiKey}, (serviceErr, service) => {
        if (serviceErr || !service) {
            return res.status(401).end();
        }

        return User.findOne({socketId: req.body.socketId}, (userErr, user) => {
            if (userErr || !user) {
                return res.status(401).end();
            }
            user.online = false;
            user.save((error) => {
                if (error) return res.status(400).end();
            });

            res.send(user.name);

            return next();
        });
    });
  }

  // decode the token using a secret key-phrase
  return jwt.verify(token, config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).send(err.name); }

    const userId = decoded.sub;

    // check if a user exists
    return User.findById(userId, (userErr, user) => {

        if (userErr || !user) {
            return res.status(401).end();
        }

        res.send(user.name);

        return next();
    });
  });
};
