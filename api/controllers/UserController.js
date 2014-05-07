/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

var githubCreds = require('../../config/local').github;

module.exports = {
    githubAuth: function (req, res) {
        passport.use(
            new GitHubStrategy({
                clientID: githubCreds.clientID,
                clientSecret: githubCreds.clientSecret,
                callbackURL: 'http://glue.dev.mavrx.io:8337/auth/github/callback/'
            },
            function (accessToken, refreshToken, profile, done) {
                User.findOrCreate({ githubId: profile.id }, function (err, user) {
                    return done(err, user);
                });
            }
        ));
    },

    githubCallback: function (req, res) {
        passport.authenticate('github', { 
            failureRedirect: '/login/' 
        });
    },
};
