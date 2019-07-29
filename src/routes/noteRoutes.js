'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var NoteController = require('../controllers/noteController')

var api = express.Router();

api.get('/', md_auth.ensureAuth, NoteController.getNotes);
api.post('/', md_auth.ensureAuth, NoteController.createNote);
api.put('/:id', md_auth.ensureAuth, NoteController.updateNote);
api.delete('/:id', md_auth.ensureAuth, NoteController.deleteNote);
api.get('/:id', md_auth.ensureAuth, NoteController.getNote);

module.exports = api;
