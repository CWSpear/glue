module.exports = function hasApiKey (req, res, next) {
    var apiKey = req.body.apiKey;

    // prefer logged in user over default user's API key
    if ((req.user || {}).id && apiKey === DefaultUser.apiKey) return next();

    // if we have neither, let's just stop them now
    if (!apiKey || apiKey === 'APIKEYGOESHERE')
        return res.forbidden('Please register for an API key.');

    User.findOne({ apiKey: apiKey }, function (err, user) {
        if (err || !(user || {}).id) return res.forbidden('Invalid/expired API key.');
        req.user = user;
        next();
    });
};