import request from 'supertest-as-promised';
import server from '../../server';

var app;

describe('INTEGRATION-TESTS::Server tests', () => {
    beforeEach(() => app = server.start());

    afterEach(done => app.close(done));

    it('should return 200 for default route', () => request(server).get('/').expect(200));

    it('should return 404 for invalid uris', () => request(server).get('/not/valid').expect(404));
});
