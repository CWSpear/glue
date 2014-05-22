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
