'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notesSchema = Schema({
    title: String,
    content: String,
    owner: { type: Schema.Types.ObjectId, ref: 'user' }
});

module.exports = mongoose.model('User', notesSchema);