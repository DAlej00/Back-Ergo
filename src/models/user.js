'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    image: String,
    notifications: Number
});

module.exports = mongoose.model('User', userSchema);