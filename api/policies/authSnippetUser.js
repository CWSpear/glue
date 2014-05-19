/**
 * User Snippet Authentication
 */

module.exports = function(req, res, next) {
    var id = req.param('id');
    // need a snippet to check by!
    Snippet.findOneById(id).then(function (snippet) {
        // if that ID wasn't even a snippet, or 
        if (!snippet) throw new Error(404);
        if (snippet.user !== req.user.id) throw new Error(403);
        return next();
    }).catch(function (err) {
        console.error(err);
        // User is not allowed to edit that snippet
        // (default res.forbidden() behavior can be overridden in `config/403.js`)
        if (err == 403) return res.forbidden('You are not permitted to perform this action.');
        if (err == 404) return res.notFound('Snippet was not found');
        return req.serverError('Unknown error');
    });
};
