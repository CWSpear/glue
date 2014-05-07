module.exports = function hasApiKey (req, res, next) {
    var apiKey = req.body.apiKey;
    var nonce  = req.body.nonce;

    // if we have neither, let's just stop them now
    if (!apiKey && !nonce)
        return res.forbidden('Please register an API Key.');

    // if we don't have an API key (but have a nonce), we don't need to validate here
    if (!apiKey) return next();

    next();
};