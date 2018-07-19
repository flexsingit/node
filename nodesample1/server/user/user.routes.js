'use strict';

var userCtrl = require('./user.controller'),
    express = require('express'),
    router = express.Router();

router.route('/signup').post(userCtrl.signup);

router.route('/signin').post(userCtrl.signin);

module.exports = router;
