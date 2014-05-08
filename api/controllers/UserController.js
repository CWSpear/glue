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

    // TODO: optimize this with some async love
    destroy: function (req, res) {
        // delete all their snippets and passports, too
        User.destroy(req.user.id).exec(function (err) {
            if (err) throw err;
            Snippet.destroy({ user: req.user.id }, function (err) {
                if (err) throw err;
                Passport.destroy({ user: req.user.id }, function (err) {
                    if (err) throw err;
                    return res.ok();
                });
            });
        });
    },
};