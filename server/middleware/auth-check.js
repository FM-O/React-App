const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const config = require('../../config');
const request = require('request');

/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];

  // decode the token using a secret key-phrase
  return jwt.verify(token, config.jwtSecret, (err, decoded) => {

    // the 401 code is for unauthorized status
    if (err) {
        if (!err.name === 'TokenExpiredError')
            return res.status(401).end();

        if (req.cookies['refreshToken']) {
            return request.get('http://10.53.37.209:3000/service/token', {json: true, headers: {'Authorization': `${req.cookies['refreshToken']}`}}, (err, result, body) => {
                if (err) { return console.log("BIGERROR : " + err); }

                res.token = result.body.token;
                res.user = result.body.user;
                res.newAccessToken = true;
                return next();
            });
        }
     }

    const userId = decoded.sub;

    // check if a user exists
    return User.findById(userId, (userErr, user) => {
      res.user = user;
      if (userErr || !user) {
        return res.status(401).end();
      }

      return next();
    });
  });
};
