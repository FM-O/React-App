const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const TokenBlacklist = require('mongoose').model('TokenBlacklist');
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
                return request.get('http://192.168.0.19:3000/service/token', {json: true, headers: {'Authorization': `${req.cookies['refreshToken']}`}}, (err, result, body) => {
                    if (err) { return console.log("BIGERROR : " + err); }

                    if (result.statusCode === 401) {
                        return res.status(401).end();
                    }

                    res.token = result.body.token;
                    res.user = result.body.user;
                    res.newAccessToken = true;
                    return next();
                });
            }
        }

        // Check if token provided is blacklisted
        return TokenBlacklist.findOne({token: token}, (tokenBlacklistErr, invalidToken) => {

            //if invalid token send unauthorized status
            if (tokenBlacklistErr || invalidToken) {
                TokenBlacklist.deleteOne({ token: invalidToken.token }, (err) => {
                    if (err) return console.log(err);
                    return res.status(401).end();
                });
            }

            //if token is valid continue
            const userId = decoded.sub;
            console.log(decoded);

            // check if a user exists
            return User.findById(userId, (userErr, user) => {
                res.user = user;
                if (userErr || !user) {
                    return res.status(401).end();
                }

                return next();
            });
        });
    });
};
