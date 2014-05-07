/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require('passport');

module.exports = {
    find: function (req, res) {
        User.findOne(req.user.id).exec(function (err, user) {
            return res.send(user);
        });
    },
};
