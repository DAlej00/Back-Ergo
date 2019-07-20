'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = Schema({
    projectOwner: {type: Schema.Types.ObjectId, ref: 'user'}, //propietario del proyecto
    name: String, //nombre del proyecto
    description: String, //descripcion del proyecto
    developerTeam: { type: Schema.Types.ObjectId, ref: 'team' } // equipo que realizará el proyecto
});

module.exports = mongoose.model('Project', projectSchema);