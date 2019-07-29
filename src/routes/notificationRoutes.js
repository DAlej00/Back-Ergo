'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var NotificationController = require('../controllers/notificationController')

var api = express.Router();

api.get('/', md_auth.ensureAuth, NotificationController.getNotifications);
api.post('/', md_auth.ensureAuth, NotificationController.createNotification);
api.put('/:id', md_auth.ensureAuth, NotificationController.updateNotification);
api.get('/:id', md_auth.ensureAuth, NotificationController.getNotification);

module.exports = api;
