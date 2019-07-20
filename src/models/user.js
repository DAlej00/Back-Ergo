'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String, //Nombre de usuario
    lastName: String, //Apellido del usuario
    username: String, //NickName del usuario
    email: String, //Email del usuario
    password: String, //contraseña
    image: String, // imagen
    notifications: Number // numero de notificaciones que tendrá
});

module.exports = mongoose.model('User', userSchema);