'use strict';

process.env.NODE_ENV = 'test';
let path 		= require('path'),
	config 		= require(path.resolve(`config/env/${process.env.NODE_ENV}`)),
	User 		= require(path.resolve('models/User')),
	chai 		= require('chai'),
	chaiHttp 	= require('chai-http'),
	server 		= require(path.resolve('server')),
	should 		= chai.should(),
	expect 		= chai.expect;

chai.use(chaiHttp);	

/* Test will successfully register a new user to database */

describe('POST /api/signupSchool', function(){
/*	before(function(done) {
		User.remove(function(err) {
			done();
		});
	});*/

	it('it should not register user without email and contact number', function(done) {
		let userJSon = {
			email_address: null,
			contact_telephoneno: null
		};
	

		chai.request(server)
			.post('/api/signupSchool')
			.send(userJSon)
			.end((err, res) => {
			expect( function () {
   				 // do stuff here which you expect to throw an exception
   				res.should.have.status(422);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('message').eql("Email and Contact No are required.");
                done();
			}).to.throw( res.body.errors );
				//expect(err).to.be.an('string');
			
			});
	});

	it('it should Register a user', function(done){
	   let userJSon = {
		    "email_address" : "ddwe@yopmail.com",
		    "contact_telephoneno" : "9835214120",
		    "first_name" : "Alexender",
		    "last_name" : "Kumar",
		    "contact_name":"ddd",
		    "contact_title":"ddd",
		    "dob" : "15-09-1993",
		    "grade" : "C",
		    "student_code" : "ST01",
		    "gender" : "Male",
		    "official_grade" : "ddd",
		    "parent_name" : "Sonu",
		    "parent_relation" : "Father",
		    "address" : "Sector-12,Noida",
		    "country" : "India",
		    "state" : "U.P.",
		    "city" : "Noida",
		    "postal_code":"201301",
		    "lat":1.54012,
		    "lng":2.8510
		 }
		chai.request(server)
			.post('/api/signupSchool')
			.send(userJSon)
			//.set('Fingerprint', Fingerprint)
			.end(function(err, res){
				expect(err).to.be.null;
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('records');
                res.body.records.should.have.property('success').eql(true);
                res.body.records.should.have.property('message').eql("Thank you for signup, The PencilsINK team will contact you shortly.");
                done();
			});
	});
});


/* Test case for login user*/

describe('POST /api/loginSchool', function(){
	
	it('it should not login when user name(email) not found or wrong user name', function(done) {
		let userJSon = {
			uan: "ddq@yopmail.com", //wrong user
			password: 'admin@virtualnotebook'
		};
	
		chai.request(server)
			.post('/api/loginSchool')
			.send(userJSon)
			.end((err, res) => {
				expect(err).to.be.null;
				res.should.have.status(422);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('message').eql("Authentication failed. User not found.");
                done();
			});
	});

	it('it should not login when password is wrong', function(done) {
		let userJSon = {
			uan: "deepak@yopmail.com",
			password: 'admin1@virtualnotebook' //wrong password
		};
	
		chai.request(server)
			.post('/api/loginSchool')
			.send(userJSon)
			.end((err, res) => {
				expect(err).to.be.null;
				res.should.have.status(422);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('message').eql("Authentication failed! Wrong Password");
                done();
		});
	});

    it('it should not login when user account is not approved by admin', function(done) {
		let userJSon = {
			uan: "ddd@yopmail.com",  //not approved this account
			password: 'admin@virtualnotebook'
		};

		chai.request(server)
			.post('/api/loginSchool')
			.send(userJSon)
			.end((err, res) => {
				expect(err).to.be.null;
				res.should.have.status(422);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('message').eql("Your account is not approved by admin, please contact admin.");
                done();
		});
	});
	
	it('Login Successfully,--Authentication success', function(done){
	   let userJSon = {
		 	uan: "deepak@yopmail.com",
			password: 'admin@virtualnotebook'
		 }
		chai.request(server)
			.post('/api/loginSchool')
			.send(userJSon)
			.end(function(err, res){
				//console.log('-----res-----',res)
				expect(err).to.be.null;
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('records');
                res.body.records.should.have.property('success').eql(true);
                res.body.records.should.have.property('user');
                res.body.records.should.have.property('token');
                done();
			});
	});
});

/*test case for forgot password*/

describe('POST /api/forgot_password', function(){

	it('Email is required for reset password', function(done) {
		let userJSon = {
			email_address: null,
		};
	

		chai.request(server)
			.post('/api/forgot_password')
			.send(userJSon)
			.end((err, res) => {
			expect( function () {
   				 // do stuff here which you expect to throw an exception
   				res.should.have.status(422);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('message').eql("Email is required");
                done();
			}).to.throw( err);
				//expect(err).to.be.an('string');
			
			});
	});

	it('Forgot password success, sent reset password link on email', function(done){
	   let userJSon = {
		    "email_address" : "deepak@yopmail.com",
	    }

		chai.request(server)
			.post('/api/forgot_password')
			.send(userJSon)
			.end(function(err, res){
				expect(err).to.be.null;
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('records');
                res.body.records.should.have.property('success').eql(true);
                res.body.records.should.have.property('message').eql("An email has been sent to your registered email with further instructions.");
                setTimeout(3000,done())
             
			});
	});
});

/*test case for reset password*/

describe('POST /api/reset_password', function(){

	it('Token is expired then not allow to reset password', function(done) {
		let userJSon = {
			email_address: null,
		};
	
		chai.request(server)
			.post('/api/reset_password')
			.send(userJSon)
			.end((err, res) => {
			expect( function () {
   				res.should.have.status(422);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('message').eql("Password reset token is invalid or has been expired.");
                done();
			}).to.throw( err);
				//expect(err).to.be.an('string');
			
			});
	});

	it('--Allow to reset password--TOKEN VALID', function(done){
	   let userJSon = {
		    "email_address" : "deepak@yopmail.com",
	    }

		chai.request(server)
			.post('/api/reset_password')
			.send(userJSon)
			.end(function(err, res){
				expect(err).to.be.null;
				res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('records');
                res.body.records.should.have.property('success').eql(true);
                res.body.records.should.have.property('message').eql("An email has been sent to your registered email with further instructions.");
                setTimeout(3000,done())
             
			});
	});
});