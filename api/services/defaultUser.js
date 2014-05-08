var defaultUser = {
    name: 'Mavrx Glue',
    email: 'glue@mavrx.io',
    id: '1714c723-0879-4a04-9297-04f572f80bec',
    apiKey: '872f5f4795204718b2377169e8bd1b4a',
    user: 'Glue',
};

module.exports = defaultUser;

// create default user if it doesn't not exist! (hacky to setTimeout to wait for models...)
setTimeout(function () {
    User.findOne(defaultUser.id, function (err, user) {
        if (err || !(user || {}).id) {
            User.create(defaultUser, function (err) {
                if (err) throw err;     
            });
        }
    });
}, 1000);