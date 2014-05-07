/**
 * SnippetController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    create: function(req, res) {
        var snippet = req.body;
        // user = user via API key || auth'd user || default user
        snippet.user = req.user.id;
        // console.log('Saving as ' + req.user.name);
        Snippet.create(snippet).exec(function (err, result) {
            if (err) {
                // Handle Error
                throw err;
            }

            if (req.body.redirect)
                return res.redirect('#/s/' + result.id);
            else
                return res.send(result, 201);
        });
    },

    raw: function (req, res) {
        var id = req.param('id');
        Snippet.findOneById(id).then(function (snippet) {
            res.set('Content-Type', 'text/plain');
            res.send(snippet.snippet);
        }, function (err) {
            res.send(err, 500);
        });
    }
};
