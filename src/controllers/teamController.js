'use strict'

var Team = require('../models/team');
var User = require('../models/user');

function createTeam(req, res) {
    var params = req.body;
    var team = new Team();

    if (!params.name && !params.description)
        return res.status(404).send({ message: 'Rellene los datos necesarios' });

    Team.find({ 'name': params.name }).exec((err, teams) => {
        if (err)
            return res.status(500).send({ message: 'Error en la petición' });
        if (teams.length > 0) {
            return res.status(404).send({ message: 'Ya tiene un equipo con este nombre' });
        } else {
            team.name = params.name
            team.description = params.description;
            team.manager = req.user.sub;
            team.integrants = [];

            team.save((err, createdTeam) => {
                if (err)
                    return res.status(500).send({ message: 'Error en la petición' });
                if (!createdTeam)
                    return res.status(404).send({ message: 'No se ha podido crear equipo' });
                return res.status(200).send({ team: createdTeam });
            });
        }
    });
}

function getTeam(req, res) {
    let id = req.params.id;

    Team.findById(id).populate('manager').exec((err, team) => {
        if (err)
            return res.status(500).send({ message: 'Error en la petición' });
        if (!team)
            return res.status(404).send({ message: 'No se ha podido obtener el equipo' });
        User.populate(team, { path: 'integrants.user', path: 'integrants.supervisor', path: 'manager' }, (err, team) => {
            // console.log([err, team]);
            if (err)
                return res.status(500).send({ message: 'Error en la petición' });
            if (!team)
                return res.status(404).send({ message: 'No se han podido obtener datos de integrantes' });
            return res.status(200).send({ team: team });
        });
    });
}

function editTeam(req, res) {
    let idTeam = req.params.id;
    let params = req.body;

    if (!params.manager == req.user.sub)
        return res.status(500).send({ message: 'Error en la petición' });

    Team.findByIdAndUpdate(idTeam, params, { new: true }, (err, updatedTeam) => {
        if (err)
            return res.status(500).send({ message: 'Error en la petición' });
        if (!updatedTeam)
            return res.status(500).send({ message: 'No se ha podido editar equipo' });
        User.populate(updatedTeam, { path: 'integrants.user', path: 'integrants.supervisor', path: 'manager' }, (err, team) => {
            // console.log([err, team]);
            if (err)
                return res.status(500).send({ message: 'Error en la petición' });
            if (!team)
                return res.status(404).send({ message: 'No se han podido obtener datos de integrantes' });
            return res.status(200).send({ team: team });
        });
    });
}

function deleteTeam(req, res) {
    var teamId = req.params.teamId;

    Team.findByIdAndDelete(teamId, (err, deletedTeam) => {
        if (err)
            return res.status(500).send({ message: 'Error en la peticion' });
        if (!deletedTeam)
            return res.status(500).send({ message: 'El equipo no pudo ser eliminado' });
        User.populate(deletedTeam, { path: 'integrants.user', path: 'integrants.supervisor', path: 'manager' }, (err, team) => {
            // console.log([err, team]);
            if (err)
                return res.status(500).send({ message: 'Error en la petición' });
            if (!team)
                return res.status(404).send({ message: 'No se han podido obtener datos de integrantes' });
            return res.status(200).send({ team: team });

        });
    });
}

function addMember(req, res) {
    var teamId = req.params.teamId;
    var integrantId = req.params.integrantId;
    var supervisorId = req.params.supervisorId;

    Team.findById(teamId, (err, foundTeam) => {
        if (err)
            return res.status(500).send({ message: 'Error al buscar equipo' });
        if (!foundTeam)
            return res.status(500).send({ message: 'Team not found' });
        foundTeam.integrants.forEach(element => {
            if (element._id === integrantId)
                return res.status(500).send({ message: 'El usuario ya es integrante de este equipo.' });
            Team.findByIdAndUpdate(teamId, {
                $addToSet: {
                    integrants: { 'user': integrantId, 'role': 'USER', 'supervisor': supervisorId }
                }
            }, { new: true }, (err, updatedTeam) => {
                if (err)
                    return res.status(500).send({ message: 'Error at adding integrant' });
                if (!updatedTeam)
                    return res.status(500).send({ message: 'Integrant could not be added' });
                User.populate(updatedTeam, { path: 'integrants.user', path: 'integrants.supervisor', path: 'manager' }, (err, team) => {
                    // console.log([err, team]);
                    if (err)
                        return res.status(500).send({ message: 'Error en la petición' });
                    if (!team)
                        return res.status(404).send({ message: 'No se han podido obtener datos de integrantes' });
                    return res.status(200).send({ team: team });
                });
            });
        });
    });
}

function removeMember(req, res) {
    var teamId = req.params.teamId;
    var managerId = req.user.sub;
    var integrantId = req.params.integrantId;

    Team.findById(teamId).exec((err, foundTeam) => {
        if (err)
            return res.status(500).send({ message: 'Error al buscar equipo' });
        if (!foundTeam)
            return res.status(500).send({ message: 'No se ha podido encontrar equipo' });
        if (foundTeam.manager == managerId) {
            Team.findByIdAndUpdate(teamId, {
                $pull: { integrants: { 'user': integrantId } }
            }, { new: true }, (err, updatedTeam) => {
                if (err)
                    return res.status(500).send({ message: 'Error al remover integrante' });
                if (!updatedTeam)
                    return res.status(500).send({ message: 'No se ha podido eliminar integrante' });
                User.populate(updatedTeam, { path: 'integrants.user', path: 'integrants.supervisor', path: 'manager' }, (err, team) => {
                    // console.log([err, team]);
                    if (err)
                        return res.status(500).send({ message: 'Error en la petición' });
                    if (!team)
                        return res.status(404).send({ message: 'No se han podido obtener datos de integrantes' });
                    return res.status(200).send({ team: team });
                });
            });
        }
    });
}

function listTeams(req, res) {
    Team.find((err, userTeams) => {
        if (err)
            return res.status(500).send({ message: 'Error en la peticion' });
        if (!userTeams)
            return res.status(404).send({ message: 'No se han obtenido los equipos' });
        User.populate(userTeams, { path: 'integrants.user', path: 'integrants.supervisor', path: 'manager' }, (err, teams) => {
            // console.log([err, teams]);
            if (err)
                return res.status(500).send({ message: 'Error en la petición' });
            if (!teams)
                return res.status(404).send({ message: 'No se han podido obtener datos de integrantes' });
            return res.status(200).send({ teams: teams });
        });
    });
}

function userTeams(req, res) {
    var userId = req.user.sub;
    Team.find({ integrants: { user: userId } }, (err, teams) => {
        if (err)
            return res.status(500).send({ message: 'Error en la peticion' });
        if (!teams)
            return res.status(404).send({ message: 'No se han podido obtener los equipos del usuario' });
        User.populate(teams, { path: 'integrants.user', path: 'integrants.supervisor', path: 'manager' }, (err, teams) => {
            // console.log([err, teams]);
            if (err)
                return res.status(500).send({ message: 'Error en la petición' });
            if (!teams)
                return res.status(404).send({ message: 'No se han podido obtener datos de integrantes' });
            return res.status(200).send({ teams: teams });
        });
    })
}

function teamsCreated(req, res) {
    var userId = req.user.sub;
    Team.find({ manager: userId }, (err, teams) => {
        if (err)
            return res.status(500).send({ message: 'Error en la peticion' });
        if (!teams)
            return res.status(404).send({ message: 'No se han podido obtener los equipos del usuario' });
        User.populate(teams, { path: 'integrants.user', path: 'integrants.supervisor', path: 'manager' }, (err, teams) => {
            // console.log([err, teams]);
            if (err)
                return res.status(500).send({ message: 'Error en la petición' });
            if (!teams)
                return res.status(404).send({ message: 'No se han podido obtener datos de integrantes' });
            return res.status(200).send({ teams: teams });
        });
    });
}



module.exports = {
    createTeam,
    addMember,
    editTeam,
    removeMember,
    deleteTeam,
    listTeams,
    getTeam,
    userTeams,
    teamsCreated
}