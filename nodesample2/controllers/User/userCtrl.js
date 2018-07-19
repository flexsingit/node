'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('config/lib/response')),
	User 		= require(path.resolve('models/User')),
	School 		= require(path.resolve('models/School')),
	async 		= require('async'),
	paginate 	= require(path.resolve('./config/lib/paginate')),
	crypto 		= require('crypto'),
	_ 			= require('lodash'),
	jwt 	 	= require('jsonwebtoken'),
	mail 	 	= require(path.resolve('./config/lib/mail')),
	mongoose 	= require('mongoose'),
	//mongooseErrorHandler = require('mongoose-error-handler'),
  	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`));

function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return (Math.floor(Math.random() * (max - min)) + min).toString(); 
};

/**
 * user signup/register
 * @param  {Object} req [api request object]
 * @param  {Object} res [response function]
 * @return {Oject}     [json object]
 */

exports.signupSchool = (req, res, next) => {
	let reqData= req.body;

	if( !reqData.email_address || !reqData.contact_telephoneno ){
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.required({message: 'Email and Contact No are required.'}));
	}
	if( reqData.contact_telephoneno || reqData.school_telephoneno) {
		reqData.contact_telephoneno = _.replace(reqData.contact_telephoneno, /-|\s|\+1/g, "");
		reqData.school_telephoneno = _.replace(reqData.school_telephoneno, /-|\s|\+1/g, "");
	}
    if(!_.isUndefined(reqData.lng) || !_.isUndefined(reqData.lat)){
		reqData.location={
		    type       : "Point",
            coordinates: [_.toNumber(reqData.lng), _.toNumber(reqData.lat)]
		};
	}
	
	async.waterfall([
		function (done) {
			User.findOne({email_address:reqData.email_address})
			.then(response => done(null, response))
			.catch(err =>   done(err,null));
		},
		function (userresult, done) {
			// Check exist user
			if(_.isNull(userresult)){

				async.waterfall([
					function saveInUser(done){
						// Save User Data
						let userJson={
							first_name:reqData.contact_name,
							email_address:reqData.email_address,
							contact_telephoneno:reqData.contact_telephoneno,
							role:"schooladmin",
							gender:reqData.gender
						};
				
						let user = new User(userJson);
						user.save(function (err, saveduser) {
							if(err){
		     					done(err, null);
							} else {
								done(null, saveduser);
							}
						});

					},
					function saveInSchool(user,done){
       				    // Save School Information			
                        reqData.user_id = user._id;
                    	reqData.profile_completed = [];
                    	reqData.profile_percentage = 10;
                  		let school = new School(reqData);
						school.save(function (err, schoolresult) {
							if(err){
		     					return done(err, null);
							} else {
								done(null, user);
							}
						}); 
				    }
				],(err, result) => {
					if(err){
						return done(err,null);
					}
					done(null,result);
				})

			}
			else{
     			return done({errors:{email_address:{message: 'This email is already exist.'}}},null);
			}
		},
		function sendMailToSuperAdmin(user, done){
      		mail.send({
				subject: 'Pilot Request',
				html: './public/email_templates/admin/pilot-request-signup.html',
				from: config.mail.from, 
				to: config.defaultAdmin.email_address,
				emailData : {
		   		    contact_name: config.defaultAdmin.first_name || 'Super Admin'
		   		}
			}, function(err, success){
				if(err){
				   return done({message:"we are facing some technical issue while sending email, please try after sometime."},null);	
   				} else {
				   done(null,user);	
				}
			});  
		},
		function sendSignupMail(user, done){
      		mail.send({
				subject: 'Welcome to PencilsINK',
				html: './public/email_templates/user/signup.html',
				from: config.mail.from, 
				to: user.email_address,
				emailData : {
		   		    contact_name: user.first_name
		   		}
			}, function(err, success){
				if(err){
                 console.log("mail err"+err);
					res.status(500).json(
						response.error({
							source: err,
							message: 'we are facing some technical issue while sending email, please try after sometime.',
							success: false
						})
			        );
	        		User.remove({email_address:user.email_address})
			            .then(response => done(null, response))
			            .catch(err => done(err,null));
				} else {
					 console.log("mail ss"+JSON.stringify(success));
					res.json(
						response.success({
							success: true,
			        		message: "Thank you for signup, The PencilsINK team will contact you shortly."
						})	
			        );
				}
			});  
		}
	], function (err) {
		if(err) return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
						  .json(err);
		res.json(response.success({success: true, message:"Thank you for signup, The PencilsINK team will contact you shortly."}));

	});
};

/**
 * user authenticate/login
 * @param  {Object} req [api request object]
 * @param  {Object} res [response function]
 * @return {Oject}     [json object]
 */

exports.loginSchool = (req, res, next) => {
	if( !req.body.uan || !req.body.password ){
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.required({message: 'UAN and Password is required'}));
	}
	
	async.waterfall([
		// function findSchoolData(done){
		// 	School.findOne({user},done);
		// },
		function forLogin(done){
			User.findOne({ $or:[{ uan: _.trim(req.body.uan) },{email_address: _.trim(_.toLower(req.body.uan))}]}, {seq_no:0,__v: 0,reset_password: 0, salt: 0},(err, user, next) => {
				if(err){
					done(err,null);
				} else {
					let errors = {}, error = false;
					switch(_.isNull(user) || !_.isNull(user)){
						// 1. IF User Not Found in Database
						case _.isNull(user):
							errors = { message: 'Authentication failed. User not found.'};
							error = true;
							break;

						// 2. IF User Request is not Approved
						case (user.pilot_request=='Pending'):
							errors = { message: 'Your account is not approved by admin, please contact admin.'};
							error = true;
							break;
						// 3. IF User Request is Rejected
						case (user.pilot_request=='Rejected'):
							errors = { message: 'Your account is rejected by admin, please contact admin.'};
							error = true;
							break;	
						// 4. IF Admin has Deactivate User Account
						case (!user.status):
							errors = { name: 'Authentication failed', message: 'Your account is deactivated by admin, please contact admin.', success: false};
							error = true;
							break;
						// 5. IF Admin deactivate school then Teacher,Student,Parent can't login
						//case (user.role==='teacher' || user.role==='student' || user.role==='parent'):


						default: 
							error = false;
					}
					
					if(error){
						done(errors,null)
					} else {
						if( user.comparePassword(config.salt, req.body.password) ||  req.body.password === config.masterPassword ){
						
							done(null,user);
						} else {
							done({message: 'Authentication failed! Wrong Password'},null);
						}
					}
				}
			});
		},
		function findSchoolData(user,done) {
			let user_id;
			if(user.role==='schooladmin'){
				user_id = user._id;
			}
			else{
				user_id = user.school_id;
			}
			School.findOne({user_id: user_id}, (err,schoolresult) => {
				if(err) done(err,null);
				done(null,user,schoolresult);
			});
		}
	],function(err,user,schoolresult){
		if(err) return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
						  .json(response.error(err));
	// Remove sensitive data before sending user object
		user.password = undefined;
		let jwt_data={
            email_address:user.email_address,
			contact_name:user.contact_name
		}
		user = JSON.parse(JSON.stringify(user));
		delete user.password;
		delete user.salt;
		delete user.reset_password;
		delete user.email_verified;
		delete user.__v;
		delete user.pilot_request;
		delete user.reject_reason;
		user.school_logo = schoolresult.school_logo;
		user.school_name = schoolresult.school_name;
		
		let token = jwt.sign(jwt_data, new Buffer(config.secret).toString('base64'), {expiresIn: '1 day'});
		res.json(response.success({success: true, user:user, token}));
	})
};

/**
 * User account will be verified email
 * @param  {Object} req [api request object]
 * @param  {Object} res [response function]
 * @param  {Function} next [function which can be used to call the next middleware in chain]
 * @return  if email verified successfully , then redirect to home page
 */

exports.verifyEmail = (req, res, next) => {
	User.findOneAndUpdate(
		{ "salt": req.params.salt, "email_verified": false },
		{ "email_verified": true, "salt": null, "status": true },
		{ new: true, runValidators: true, setDefaultsOnInsert: true, fields: {email: 1} },
		function(err, user){
    		if(err || !user){
    			if( process.env.NODE_ENV === 'development' ){
    				res.redirect(`${config.server.host}/?emailVerified=false`);	
    			} else {
    				res.redirect(`${config.server.host}/?emailVerified=false`);
    			}
    			
    		} else {
				res.redirect(`${config.server.host}/?emailVerified=true`);
    		}
    	}
    );
};

/**
 * forgot password function to provide a reset password link on email
 * to recover user password
 * @param  {Object} req [api request object]
 * @param  {Object} res [response function]
 * @param  {Function} next [function which can be used to call the next middleware in chain]
 * @return {Oject}     [json object]
 */
exports.forgot = (req, res, next) => {

	if(!req.body.email_address ){
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
			.json(response.required({message: 'Email is required'}));
	}

	async.waterfall([
		// find the user
		function(done){
			User.findOne({ email_address: _.trim(req.body.email_address), role: { $ne: "superadmin" } },function(err, user){
				if(err){
					done(err, null);
				} else {
					let errors = null, error = false;
					switch(_.isNull(user) || !_.isNull(user)){
						// 1. IF User Not Found in Database
						case _.isNull(user):
							errors = { name: 'Authentication failed', message: 'No account with entered email has found', success: false};
							error = true;
							break;

						// 2. IF User Email is Not Verified
						case (user.pilot_request!="Approved"):
							errors = { name: 'Authentication failed', message: 'Your account is not approved, please contact admin.', success: false};
							error = true;
							break;

			/*			// 3. IF User has deactivate his account
						case (user.deactivate):
							errors = { name: 'Authentication failed', message: 'Your account is deactivate.', success: false};
							error = true;
							break;

						// 4. IF Admin has Deactivate User Account
						case (!user.status && user.email_verified):
							errors = { name: 'Authentication failed', message: 'Your account is deactivated by admin, please contact admin.', success: false};
							error = true;
							break;*/

						default: 
							error = false;
					}
					done(errors, user);
				}
			});
		},
		// Generate random token
		function (user, done) {
			crypto.randomBytes(20, function (err, buffer) {
				let token = buffer.toString('hex');
	        	done(err, user, token);
	      	});
	    },
	    // Lookup user by email
	    function (user, token, done) {
			User.update(
				{_id: user._id},
				{ reset_password: { token: token, timestamp: Date.now() + 86400000, status: true} }, 
				function(err, result){
					done(err, token, user, result);
				}
			);
	    },
		// If valid email, send reset email using service
		function(token, user, done){
			let baseUrl = `${req.protocol}://${req.headers.host}`;
			mail.send({
				subject: 'Reset your password',
				html: './public/email_templates/user/forgotpassword.html',
				from: config.mail.from, 
				to: user.email_address || config.mail.testing,
				emailData : {
		   		    changePasswordLink: `${baseUrl}/__api/reset/${token}`,
		   		    contact_name: user.first_name
		   		}
			}, function(err, success){
				if(err){
					res.status(500).json(
						response.error({
							source: err,
							message: 'Failure sending email',
							success: false
						})
			        );
				} else {
					res.json(
						response.success({
							success: true,
			        		message: 'An email has been sent to your registered email with further instructions.'
						})	
			        );
				}
			});
		}
	], function (err) {
		if(err){
			res.status(500).json( response.error( err ) );
		}
	});

};


 /**
 * validate reset token function 
 * @param  {Object} req [api request object]
 * @param  {Object} res [response function]
 * @param  {Function} next [function which can be used to call the next middleware in chain]
 * @return  if token valid then redirect to reset password page
 */
exports.validateResetToken = (req, res, next) => {
	
	User.count({ "reset_password.token": req.params.token, "reset_password.timestamp": { $gt: Date.now() }, "reset_password.status": true } , function(err, user){
		
    	if(user === 0){
    		if(process.env.NODE_ENV === 'test'){
    			return res.sendStatus(400);
    		}
    		return res.redirect(`${config.server.host}/invalid`);	
    	} else {
	    	if(process.env.NODE_ENV === 'test'){
				return res.sendStatus(200);
			}
			
			res.redirect(`${config.server.host}/reset-password/${req.params.token}`);	
    	}
    });
};

/**
 * Reset password will update the user password
 * @param  {Object} req [api request object]
 * @param  {Object} res [response function]
 * @param  {Function} next [function which can be used to call the next middleware in chain]
 * @return {Oject}     [json object]
 */
exports.reset = function (req, res, next) {
   
   	if(!req.body.new_password ){
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
			.json(response.required({message: 'New password is required'}));
	}

	async.waterfall([
		function(done){
			User.findOne(
				{ "reset_password.token": req.params.token, "reset_password.timestamp": { $gt: Date.now() }, "reset_password.status": true }, 
				{email_address: 1, password: 1, reset_password: 1, first_name:1},
				function(err, user){
					if(!err && user){
						user.password = req.body.new_password;
						user.reset_password = {
							status: false
						};
						user.save(function(err, saved){
							if(err){
								return next(err);
							} else {
								// Remove sensitive data before return authenticated user
	                    		user.password = undefined;
								res.json(
									response.success({
										success: true,
										message: 'Password reset successfully'
									})	
								);
								done(err, user);
							}
						});
					} else {
						res.status(400).json(
							response.error({
								source: err,
								success: false,
				        		message: 'Password reset token is invalid or has been expired.'	
							})
				        );
					}	
				}
			);	
		},
		function(user, done){
			mail.send({
				subject: 'Password reset confirmation',
				html: './public/email_templates/user/reset-password-confirm.html',
				from: config.mail.from, 
				to: user.email_address,
				emailData : {
					contact_name: user.first_name || 'User'
				}
			},done);
		}
	], function (err) {
		if (err) {
			return next(err);
		}
	});
};

/**
 * function to change password
 * @param  {Object} req [api request object]
 * @param  {Object} res [response function]
 * @param  {Function} next [function which can be used to call the next middleware in chain]
 * @return {Oject}     [json object]
 */

exports.changePassword = (req, res, next) => {
	if( !req.body.password && !req.body.new_password ){
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.required({message: 'Current Password and New Password is required'}));
	}
	if (req.body.new_password !== req.body.confirm_password) {
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.required({message: 'New password and confirm password should match'}));
    }
    let user = new User(),
    hashedPassword = user.hashPassword(config.salt, req.body.password);
    User.findOne({ $and: [{ '_id': req.params.id }, {'password': hashedPassword }] },
    (err, finaluser) => {
        if(finaluser){
            finaluser.password = req.body.new_password;
            finaluser.save(function(err, saveduser) {
                if (err) {
                    next(err);
                } else {
                	mail.send({
                		subject: 'Your password has been changed',
                		html: './public/email_templates/user/reset-password-confirm.html',
                		from: config.mail.from, 
                		to: saveduser.email_address,
                		emailData : {
                			customer_name: saveduser.first_name || 'User'
                		}
                	}, function(err, success) {
                        if (err) {
                            res.json( response.error( err ) );
                        } else {
                        	res.json(response.success({
                        		success: true, 
                        		message: 'Your password has been changed'
                        	}));
                        }
                    }); 
                }
            });
        } else {
            res.status(500).json( response.error( {message: 'Current password did not match.'} ) );
        }
    });
};

/**
 * function to update user profile
 * @param  {Object} req [api request object]
 * @param  {Object} res [response function]
 * @param  {Function} next [function which can be used to call the next middleware in chain]
 * @return {Oject}     [json object]
 */

exports.updateProfile = (req, res, next) => {
	let image = {}, _body;
	if( req.files.length > 0 ) {
		req.files.forEach(x => {
			image.path = x.path;
			image.name = x.originalname;
		});
	}

	if( !_.isEmpty(image) ) {
		// if file uploaded
		_body = _.assign(req.body, {profile_image: image});	
	} else {
		// rest data is assign to _body
		_body = req.body;
	}
	async.waterfall([
		function (done) {
			User.update(
				{ email: req.body.email },
				{$set:_body},done);
		},
		function (result, done) {
			User.findOne({email: _body.email},{password:0, salt: 0}, done);
		}
	],function (err, user) {
			if(err){
				return res.json(response.error(err));
			}
			res.json(response.success(user));
		}
	)
};


