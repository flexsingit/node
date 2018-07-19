'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

/**
 * Users Schema
 */
var userSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    emailid: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    salt: {
        type: String
    },
    mobile: {
        type: String,
        trim: true
    },
    date_created: {
        type: Date,
        default: Date.now
    }
});

/**
 * Hook a pre save method to hash the password
 */
userSchema.pre('save', function (next) {
    if (this.password && this.isModified('password')) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

/**
 * Create instance method for hashing a password
 */
userSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
userSchema.methods.authenticate = function (password) {
    return (this.password === this.hashPassword(password));
};

module.exports = mongoose.model('User', userSchema);

