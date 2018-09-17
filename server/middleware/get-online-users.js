const User = require('mongoose').model('User');
const config = require('../../config');

/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {

    // check which users are online
    return User.find({online: true}, '-_id name', (userErr, users) => {
        res.users = users;
        if (userErr || !users) {
            return res.status(401).end();
        }

        return next();
    });
};
