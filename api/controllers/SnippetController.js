/**
 * SnippetController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    create: function (req, res) {
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

    update: function (req, res, next) {
        var snippet = req.body;
        // user = user via API key || auth'd user || default user
        snippet.user = req.user.id;
        Snippet.update(snippet.id, snippet).exec(function (err, snippets) {
            if (err) return next(err);
            snippet = snippets[0];
            Snippet.publishUpdate(snippet.id, snippet);
            return res.send(snippet);
        });
    },

    subscribe: function (req, res) {
        var id = req.param('id');
        Snippet.findOneById(id).exec(function (err, snippet) {
            // Subscribe the requesting socket (e.g. req.socket) to all users (e.g. users)
            Snippet.subscribe(req.socket, snippet, 'update');
            res.send(snippet);
        });
    },

    // the only bloody reason we need this function is because
    // Sails is auto populating this with the user info, even
    // tho we don't want it to!!!1!
    findOne: function (req, res) {
        var id = req.param('id');
        Snippet.findOneById(id).exec(function (err, result) {
            if (err) throw err;

            if (!result)
                return res.notFound('No Snippet found with ID ' + id);

            delete result.user;

            return res.send(result);
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
