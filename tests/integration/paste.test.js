import request from 'supertest-as-promised';
import server from '../../server';
import chai from 'chai';
import moduleLoader from 'es6-module-loader';

var System = moduleLoader.System;

var app;
chai.should();

System.import('chai-datetime')
    .then((dateTime) => chai.use(dateTime));

describe.skip('INTEGRATION-TESTS::Paste API tests', () => {
    beforeEach(() => app = server.start());

    afterEach((done) => app.close(done));

    it('should return 201 and a slug when a post is successful', () => {
        return request(server)
            .post('api/paste', {
                body: 'test data'
            })
            .expect(201)
            .expect(function(res) {
                res.body.should.have.property('slug').and.exist();
                res.body.should.have.property('createdById').and.exist();
            });
    });

    it('should return 500 when post fails', () => {
        true.should.be.false;
    });

    it('should return 400 when posting without body', () => {
        return request(server)
            .post({})
            .expect(400);
    });

    it('should return 200 when put is successful', () => {
        return request(server)
            .post('api/paste', {
                body: 'test data'
            })
            .then(updatePasteAndAssert);

        function updatePasteAndAssert(postResult) {
            var body = 'test data1';
            return request(server)
                .put('api/paste', {
                    body: body,
                    slug: 'abcd'
                })
                .expect(200)
                .expect(function(putResult) {
                    putResult.body.should.have.property('slug').equals(postResult.body.slug);
                    putResult.body.should.have.property('createdById').equals(postResult.body.createdById);
                    putResult.body.should.have.property('body').equals(body);
                    putResult.body.should.have.property('lastModified').afterTime(postResult.body.lastModified);
                });
        }
    });

    it('should return 500 when put fails', () => true.should.be.false);

    it('should return 404 when slug is not found during put', () => true.should.be.false);

    it('should return 200 and the paste when a get is successful', () => true.should.be.false);

    it('should return 500 when get fails', () => true.should.be.false);

    it('should return 404 when slug is not found during get', () => true.should.be.false);

    it('should return 200 when delete is successful', () => true.should.be.false);

    it('should return 404 when slug is not found during delete', () => true.should.be.false);
});
