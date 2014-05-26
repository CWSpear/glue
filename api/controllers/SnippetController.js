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
        snippet.isUpdate = true;
        Snippet.update(snippet.id, snippet).then(function (snippets) {
            var snip = snippets[0];
            return res.send(snip);
        }).catch(function (err) {
            res.serverError(err);
        });
    },

    subscribe: function (req, res, next) {
        var id = req.param('id');
        Snippet.findOneById(id).then(function (snippet) {
            if (!snippet) return res.notFound('No Snippet found with ID ' + id);

            // Subscribe the requesting socket (e.g. req.socket) to all users (e.g. users)
            Snippet.subscribe(req.socket, snippet, 'update');
            res.send(snippet);
        }).catch(function (err) {
            res.serverError(err);
        });
    },

    notify: function (req, res, next) {
        var id = req.param('id');
        var payload = req.body;
        payload.socketId = req.socket.id;
        if (payload.language) 
            payload.filename = Helpers.getFileNameFromSnippetModel(payload, true);
        Snippet.publishUpdate(id, payload, req);
        res.ok();
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
            res.serverError(err);
        });
    }
};
