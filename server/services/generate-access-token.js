const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const config = require('../../config');

/**
 *  Generate new accessToken
 */
module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).end();
    }

    const refreshToken = req.headers.authorization;

    // check if there is a corresponding token in database then return user
    return User.findOne({refreshToken: refreshToken}, (userErr, user) => {
        if (userErr || !user) {
            return res.status(401).end();
        }

        const payload = {
          sub: user._id,
          exp: Math.floor(Date.now() / 1000) + (30)
        };

        // Generating new access token
        const token = jwt.sign(payload, config.jwtSecret);

        res.send({token: token, user: user});
        return next();
    });
};
