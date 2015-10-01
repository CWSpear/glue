'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var debug = require('debug')('server');
var chalk = require('chalk');

var server = loopback();

server.start = () => {
    // start the web server
    return server.listen(() => {
        debug(`started on port ${chalk.magenta(server.settings.port)}`);
        server.emit('started');
    });
};

// Bootstrap loopback
boot(server, __dirname, (err) => {
    if (err) throw err;
    debug('loopback bootstraped');
    // start the server if `$ node server.js`
    if (require.main === module) {
        server.start();
    }
});

export default server;
