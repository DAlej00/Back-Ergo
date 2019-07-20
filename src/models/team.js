'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = Schema({
    name: String, //nombre del equipo
    description: String, //descripcion
    integrants: [{
        user: { type: Schema.Types.ObjectId, ref: 'user' }, //Integrante
        role: String, //rol...Developer || Supervisor
        supervisor: { type: Schema.Types.ObjectId, ref: 'user' } //Persona que revisará las tareas de los demás.
    }]
});

module.exports = mongoose.model('Team', teamSchema);