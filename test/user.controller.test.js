var chai = require('chai'),
    expect = chai.expect;

let mongoose = require("mongoose"),
    chaiHttp = require('chai-http'),
    server = require('../server'),
    should = chai.should(),
    config = require('../config/config')(),
    request = require('supertest')

chai.use(chaiHttp);

describe('Login API', function () {
    var url = 'http://localhost:3000/user/api';

    before(function (done) {
        mongoose.connect(config.dbPath, {useMongoClient: true});
        done();
    });
    
    it('Should have status code 200 and success:true if credential is valid', function (done) {
        request(url)
            .post('/signin')
            .send({ username: 'manoj1989', password: '12345' })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.should.have.status(200);
                res.body.success.should.equal(true);
                done();
            });
    });

    it('Should have status code 401 and success:false if credential is not valid', function (done) {
        request(url)
            .post('/signin')
            .send({ username: 'manoj1989', password: '123456' })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.should.have.status(401);
                res.body.success.should.equal(false);
                done();
            });
    });

    it('Should have data key and success:true in response if credential is valid', function (done) {
        request(url)
            .post('/signin')
            .send({ username: 'manoj1989', password: '12345' })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.should.have.property('data');
                res.body.success.should.equal(true);
                done();
            });
    });

    it('Should response always have a Object', function (done) {
        request(url)
            .post('/signin')
            .send({ username: 'asas', password: 'asasa' })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                done();
            });
    });
});