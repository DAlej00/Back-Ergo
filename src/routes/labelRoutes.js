'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var LabelController = require('../controllers/labelController')

var api = express.Router();

api.get('/',md_auth.ensureAuth, LabelController.getLabels);
api.post('/', md_auth.ensureAuth, LabelController.createLabel);
api.put('/:id', md_auth.ensureAuth, LabelController.editLabel);
api.delete('/:id', md_auth.ensureAuth, LabelController.deleteLabel);
api.get('/:id', md_auth.ensureAuth, LabelController.getLabel);

module.exports = api;
