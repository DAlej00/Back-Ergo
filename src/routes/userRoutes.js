'use strict'

var express = require('express');
var userController = require('../controllers/userController');
var md_auth = require('../middlewares/authentication');

//SUBIR IMAGEN
var multiParties = require('connect-multiparty');
var md_subir = multiParties({ uploadDir: './src/uploads/users' })

var api = express.Router();

api.post('/login', userController.login);
api.post('/sign-up', userController.signUp);
api.put('/:id', md_auth.ensureAuth, userController.editUser);
api.delete('/:id', md_auth.ensureAuth, userController.deleteUser);
api.get('/', md_auth.ensureAuth, userController.getUser);
api.get('/', md_auth.ensureAuth, userController.listUsers);
api.get('/image/:nameImage', userController.getImage);
api.post('/:id/subir-imagen', [md_auth.ensureAuth, md_subir], userController.uploadImage);

module.exports = api;
