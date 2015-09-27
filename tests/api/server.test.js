'use strict';

var request = require('supertest');
var server = require('../../server');

var app;

describe('server tests', function () {
    beforeEach(function () {
        app = server.start();
    });

    afterEach(function (done) {
        app.close(done);
    });

    it('should return 200 for default route', function (done) {
        request(server)
            .get('/')
            .expect(200, done);
    });

    it('should return 404 for invalid uris', function (done) {
        request(server)
            .get('/not/valid')
            .expect(404, done);
    });
});
