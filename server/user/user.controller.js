'use strict';
var mongoose = require('mongoose'),
  userModel = require('./user.model'),
  passport = require('passport'),
  config = require('../../config/config')();

/**
 * Signup Api
 * Format Required
 * {
    "name":"Manoj Bhagat",
    "emailid":"manoj@gmail.com",
    "password":"12345",
    "username":"manoj1989",
    "mobile":"9582612232"
  }
*/
exports.signup = function (req, res) {
  var newUserData = new userModel({
    name: req.body.name,
    emailid: req.body.emailid,
    password: req.body.password,
    username: req.body.username
  });
  newUserData.save(function (err) {
    if (err) {
      return res.status(422).send({
        success: false,
        message: err
      });
    } else {
      res.json({ success: true, message: 'User has created successfully.' });
    }
  });
};


/**
 * Signin Api
 * Format Required
 * {
    "username":"manoj1989",
    "password":"12345"
    }
*/
exports.signin = function (req, res) {
  userModel.findOne({
    username: req.body.username
  }, function (err, user) {
    if (err) {
      return res.status(422).send({
        success: false,
        message: err
      });
    }
    if (!user) {
      res.status(401).send({ success: false, message: 'User does not exist.' });
    } else {
      var isMatch = user.authenticate(req.body.password);
      if (isMatch) {
        return res.json({ success: true, data: user });
      } else {
        return res.status(401).send({ success: false, message: 'Invalid username or password.'});
      }
    }
  });
}
