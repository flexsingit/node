"use strict";

const 	express 	= require('express'),
		path 		= require('path'),
		expressJWT 	= require('express-jwt'),
		config 		= require(require(path.resolve('./config/env')).getEnv),
		userRoutes 	= require(path.resolve('./config/user_router')),
		adminRoutes = require(path.resolve('./config/admin_router')),
		matchRoute 	= require(path.resolve('./config/lib/matchRoute')),
		router 		= express.Router(),
		admin 		= express.Router();


/* Express JWT middleware for user routes */
router.use(expressJWT({
	secret: new Buffer(config.secret).toString('base64'),
}).unless({
	// Define your path/routes that does not need any authentication
	path:[
		/^\/admin\/.*/,
		'/favicon.ico',
		'/api/signupSchool',
		'/api/loginSchool',
		'/api/forgot_password',
		'/api/setting_homepage',
		'/api/settings',
		'/api/getschoolprofile_step',
		'/api/contactus',
		'/api/get_master_data',
		'/api/delete_subject',
		'/api/get_class',
		'/api/delete_section',
		'/api/get_section',
		'/api/get_subject',
		'/api/getfaq',
		'/api/cron',
		'/api/verify',
		'/api/class_code_list',
		/^\/api\/cms\/.*/,
		/^\/api\/(reset|reset_password)\/.*/,
		/^\/__api\/(reset|reset_password)\/.*/,
		/^\/api\/verify_email\/.*/,
	]
}));
/*
* These are our base routes that will call simple prefixed by '/'
* eg. /login
*/
userRoutes.routes.forEach(x => matchRoute(router, x));

/*
* All the routes of admin will requests using admin prefix
* eg. /admin/login and so on
*/
/* Express JWT middleware for admin routes */
admin.use(expressJWT({
	secret: new Buffer(config.secret).toString('base64'),
}).unless({
	// Define your path/routes that does not need any authentication
	path:[
		'/admin/register',
		'/adminapi/login',
		'/adminapi/forgotpassword',
		/^\/adminapi\/reset|reset_password\/.*/,
		'/admin/forgot',
		/^\/__adminapi\/reset|reset_password\/.*/,
		/^\/admin\/generate-password\/.*/,
		/^\/adminapi\/verify_email\/.*/,
	]
}));
/*Admin Routes*/

adminRoutes.routes.forEach(x => matchRoute(admin, x));

module.exports = {
	router: router,
	admin: admin
};