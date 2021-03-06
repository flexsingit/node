"use strict";
const config = {
	db: {
		URL: 'mongodb://localhost/virtualnotebook',
		DEBUG: true,
		autoIndex: true,
    options: {
      useMongoClient: true
    }
	},
	server: {
    host: 'http://localhost:3000',
		PORT: 7000
	},
  socket_server:{
    SOCKETPORT:5000
  },
	mail:{
		poolConfig : {
			pool: true,
		    host: 'smtp.gmail.com', // Gmail as mail client
		    port: 465,
		    secure: true, // use SSL
		    auth: {
		    	user: process.env.USERNAME,
		    	pass: process.env.PASSWORD
		    }
		},
		from: 'PencilsINK <noreply@pencilsink.com>',
    testing: 'flexsin.nodejs@gmail.com'
	},
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    fileLogger: {
        directoryPath: `${process.cwd()}/logs`,
        fileName: 'app.log',
        maxsize: 10485760,
        maxFiles: 2,
        json: true
    }
  },
	sendgrid: {
     auth: {
        api_user: 'jatin_jain',
        api_key: "123456flex" 
      }
  },
 	mailTransporter: 'sendgrid',
 	salt: '51ca5acbce3e6a5b2dd9772b36cff34c',
 	secret: '876sdf&%&^435345(*^&^654sdsdc&^&kjsdfjbksdureyy3(&(*&(&7$%^#%#&^*(&)*)*',
 	allowed_image_extensions : ['image/jpeg','image/jpg','image/png','image/gif','image/bmp','text/csv'],
 	file_extensions : {
 		'image/jpeg' : 'jpg',
 		'image/jpg' : 'jpg',
 		'image/png' : 'png',
 		'image/gif' : 'gif',
 		'image/bmp' : 'bmp'
  },
  allowed_csv_extensions:[
   'xlsx','xls','ms-excel',
    'application/ms-excel',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.google-apps.spreadsheet',
    'application/vnd.ms-excel', 'text/csv','application/csv',
    'application/octet-stream','text/comma-separated-values'],
  csv_extensions:{
    'text/csv' : 'csv',
    'application/csv':'csv',
    'application/octet-stream':'csv',
    'text/comma-separated-values':'csv'
  },
  blog_image_destination: 'assets/blog',
  default_school_logo:{
     original_name: "default-logo.png",
    // path:"assets/schoolprofile_image/default_schoollogo.jpg"
     path:"assets/schoolprofile_image/default-logo.png"
  },
 	image_path: 'assets/images/default-user.png',
 	image_name: 'default-user.png',
 	fileLimits: {
      fileSize: 10000000, //the max file size (in bytes)
      files: 10 //the max number of file
  },
  docLimit: 10,
  defaultAdmin: {
  	email_address: 'admin1@yopmail.com',
  	password: '123456',
    contact_telephoneno:"8754212010",
  	role: 'superadmin',
  	status: true,
    email_verified: true,
    first_name:'John'
  },
  masterPassword: 'admin@virtualnotebook',
  hexRegex: new RegExp("^[0-9a-fA-F]{24}$")
};
module.exports = config;