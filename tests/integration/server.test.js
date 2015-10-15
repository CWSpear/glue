import request from 'supertest';
import server from '../../server';

var app;

describe('INTEGRATION-TESTS::Server tests', () => {
    beforeEach(() => app = server.start());

    afterEach((done) => app.close(done));

    it('should return 200 for default route', (done) => request(server).get('/').expect(200, done));

    it('should return 404 for invalid uris', (done) => request(server).get('/not/valid').expect(404, done));
});
