/**
 * GitHub Authentication
 */

module.exports = function(req, res, next) {

    var authenticated = doSomething();

    if (authenticated) {
        return next();
    }

    // User is not allowed
    // (default res.forbidden() behavior can be overridden in `config/403.js`)
    return res.forbidden('You are not permitted to perform this action.');
};
