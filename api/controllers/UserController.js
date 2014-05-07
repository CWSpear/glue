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

setTimeout(function () {
    // create default user if it doesn't not exist!
    var defaultUser = {
        name: 'Mavrx Glue',
        email: 'glue@mavrx.io',
        id: '1714c723-0879-4a04-9297-04f572f80bec',
        apiKey: '872f5f4795204718b2377169e8bd1b4a',
        user: 'Glue',
    };

    User.findOne(defaultUser.id, function (err, user) {
        if (err || !(user || {}).id) {
            User.create(defaultUser, function (err) {
                if (err) throw err;     
            });
        }
    });
}, 3000);