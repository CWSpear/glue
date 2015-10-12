import request from 'supertest';
import server from '../../server';
import chai from 'chai';

var app;
chai.should();

describe('INTEGRATION-TESTS::Paste API tests', () => {
    beforeEach(() => app = server.start());

    afterEach((done) => app.close(done));

    it('should return 200 and a slug when a post is successful', () => true.should.be.false);

    it('should return 500 when post fails', () => true.should.be.false);

    it('should return 201 when put is successful', () => true.should.be.false);

    it('should return 500 when put fails', () => true.should.be.false);

    it('should return 404 when slug is not found during put', () => true.should.be.false);

    it('should return 200 and the paste when a get is successful', () => true.should.be.false);

    it('should return 500 when get fails', () => true.should.be.false);

    it('should return 404 when slug is not found during get', () => true.should.be.false);

    it('should return 200 when delete is successful', () => true.should.be.false);

    it('should return 404 when slug is not found during delete', () => true.should.be.false);
});
