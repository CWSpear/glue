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
        var session = snippet.session;
        snippet.isUpdate = true;
        Snippet.update(snippet.id, snippet).then(function (snippets) {
            var snip = snippets[0];

            var update = _.clone(snip);
            update.session = session;
            Snippet.publishUpdate(update.id, update);

            return res.send(snip);
        }).catch(function (err) {
            res.serverError(err);
        });
    },

    subscribe: function (req, res, next) {
        var id = req.param('id');
        Snippet.findOneById(id).then(function (snippet) {
            if (!snippet) return res.notFound();

            // Subscribe the requesting socket (e.g. req.socket) to all users (e.g. users)
            Snippet.subscribe(req.socket, snippet, 'update');
            res.send(snippet);
        }).catch(function (err) {
            res.serverError(err);
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
