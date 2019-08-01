'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificationSchema = Schema({
    from: { type: Schema.Types.ObjectId, ref: 'user' }, //Emisor --user123--
    to: { type: Schema.Types.ObjectId, ref: 'user' }, //Receptor --user321--
    title: String, // Hola user321, únete a mi equipo
    description: String, // 'user123 te ha invitado a estar en su equipo'
    checked: Boolean, //Leído
    answered: Boolean // Respuesta
});

module.exports = mongoose.model('Conversation', notificationSchema);