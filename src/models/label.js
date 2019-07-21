'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var labelSchema = Schema({
    // @TODO Deberiamos asociar las etiquetas a un usuario.
    // De lo contrario son universales para todos los usuario.
    name: String, //nombre de la etiqueta
    description: String, // descripción
    user: { type: Schema.Types.ObjectId, ref: 'user' } //usuario que la creó
});

module.exports = mongoose.model('Label', labelSchema);
