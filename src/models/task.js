'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = Schema({
    name: String, //nombre de la tarea
    description: String, // descripcion de la tarea
    deadline: Date, // fecha máxima para terminar tarea
    labels: [{ type: Schema.Types.ObjectId, ref: 'label' }], //etiqueta de relevancia, ejemplo: label.name = 'URGENTE'
    taskOwner: { type: Schema.Types.ObjectId, ref: 'user' }, //persona o propietario que tendrá asignada la tarea.
    project: {type: Schema.Types.ObjectId, ref: 'project'}, // proyecto al que estará relacionada la tarea.
    finish: Boolean, // Este campo lo puede editar el supervisor, este cambiará a true si la tarea está bien hecha, caso contrario el responsable de la tarea debe arreglarla.
    checked: Boolean // La persona que ya finalizó la tarea puede cambiar ese campo para que la tarea realizada pase a revisión.
});

module.exports = mongoose.model('Task', taskSchema);