var express = require("express");
var morgan = require("morgan");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/config')();
var passport = require('passport');
let port = config.port;

mongoose.connect(config.dbPath, {useMongoClient: true});

app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());
app.use(morgan("tiny"));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(passport.initialize());

var user = require('./server/user/user.routes');
app.use('/user/api/', user);

app.listen(port);
console.log("Listening on port " + port);

module.exports = app;