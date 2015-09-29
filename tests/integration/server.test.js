'use strict';

var request = require('supertest');
var server = require('../../server');

var app;

describe('server tests', () => {
    beforeEach(() => {
        app = server.start();
    });

    afterEach((done) => {
        app.close(done);
    });

    it('should return 200 for default route', (done) => {
        request(server)
            .get('/')
            .expect(200, done);
    });

    it('should return 404 for invalid uris', (done) => {
        request(server)
            .get('/not/valid')
            .expect(404, done);
    });
});
