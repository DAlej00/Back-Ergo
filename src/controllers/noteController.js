'user strict'

var Note = require('../models/notes');

function createNote(req, res){
    var params = req.body;
    var note = new Note();
    if(params.title && params.content){
        note.title = params.title;
        note.content = params.content;
        note.owner = req.user.sub;
        note.save((err, savedNote) =>{
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if(!savedNote) return res.status(404).send({message: 'No se ha podido crear la nota'});
            return res.status(200).send({note: savedNote});
        });

    }else return res.status(404).send({message: 'Debe rellenar todos los datos'})
}

function updateNote(req, res) {
    var noteId = req.params.id;
    var params = req.body

    delete params.owner;

    Note.findByIdAndUpdate(noteId, params, {new: true}, (err, updatedNote) => {
        if (err) return res.status(500).send({message: 'Error en la peticion'});
        if (!updatedNote) return res.status(404).send({message: 'No se ha podido actualizar la nota'});
        return res.status(200).send({note: updateNote});
    });
}

function deleteNote(req, res) {
    var noteId = req.params.id;
    Note.findOneAndDelete(noteId, (err, deletedNote) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!deletedNote) return res.status(404).send({message: 'No se ha podido eliminar la Nota'})
        return res.status(200).send({note: deletedNote});
    });
}

function getNote(req, res) {
    var noteId = req.params.id;
    Note.findById(noteId, (err, note) => {
        if(err) return res.status(200).send({message: 'Error en la peticion'});
        if(!note) return res.status(404).send({message: 'No se ha podido obtener la nota'});
        return res.status(200).send({note: note});
    });
}

function getNotes(req, res) {
    var userId = req.user.sub;
    Note.find({owner: userId}, (err, notes) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!notes) return res.status(404).send({message: 'No se han podido obtener las notas'})
        return res.status(200).send({notes: notes});
    });
}

module.exports = {
    createNote,
    updateNote,
    deleteNote,
    getNote,
    getNotes
}