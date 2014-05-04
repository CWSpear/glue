/**
 * SnippetController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
module.exports = {
    display: function (req, res) {
        var id = req.param('id');
        Snippet.findOneById(id).then(function (snippet) {
            res.view('display', { snippet: snippet });
        }, function (err) {
            res.send(err, 500);
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
    },

    goHome: function (req, res) {
        res.redirect('/', 301);
    },

    index: function (req, res) {
        res.view('display');
    }
};
