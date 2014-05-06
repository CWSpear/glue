module.exports = function hasNonce (req, res, next) {
    var apiKey = req.body.apiKey;
    var nonce  = req.body.nonce;

    if (!apiKey && !nonce)
      return res.forbidden('Please register an API Key.');

    next();
};