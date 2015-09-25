var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = () => {
    // start the web server
    return app.listen(() => {
        app.emit('started');
    });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, (err) => {
    if (err) throw err;

    // start the server if `$ node server.js`
    if (require.main === module) {
        app.start();
    }
});
