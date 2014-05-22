/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require('passport');

module.exports = {
    getSelf: function (req, res) {
        User.findOne(req.user.id).populate('snippets').then(function (user) {
            return res.send(user);
        }).catch(function (err) {
            throw err;
        });
    },

    destroy: function (req, res) {
        var userId = req.user.id;

        // delete all their snippets and passports, too
        User.destroy(userId).then(function () {
            return Snippet.destroy({ user: userId });
        }).then(function () {
            return Passport.destroy({ user: userId });
        }).then(function () {
            return res.ok();
        }).catch(function (err) {
            throw err;
        });
    },
};