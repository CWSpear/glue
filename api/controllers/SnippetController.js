/**
 * SnippetController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
module.exports = {
    create: function(req, res) {
        // TODO: test apiKey
        Snippet.create(req.body).exec(function (err, result){
            if (err) {
                // Handle Error
            }
            if (req.body.redirect)
                return res.redirect('#/s/' + result.id);
            else
                return res.send(result, 201);
        });
    }

    // display: function (req, res) {
    //     var id = req.param('id');
    //     Snippet.findOneById(id).then(function (snippet) {
    //         res.view('display', { snippet: snippet });
    //     }, function (err) {
    //         res.send(err, 500);
    //     });
    // },

    // raw: function (req, res) {
    //     var id = req.param('id');
    //     Snippet.findOneById(id).then(function (snippet) {
    //         res.set('Content-Type', 'text/plain');
    //         res.send(snippet.snippet);
    //     }, function (err) {
    //         res.send(err, 500);
    //     });
    // },

    // goHome: function (req, res) {
    //     res.redirect('/', 301);
    // },

    // index: function (req, res) {
    //     res.view('display');
    // }
};
