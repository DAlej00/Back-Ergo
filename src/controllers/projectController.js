'use strict'

var Project = require('../models/project');
var User = require('../models/user');
var Team = require('../models/team');

function addProject(req, res) {
    var params = req.body;
    var projectOwner = req.user.sub;
    var project = new Project();

    if (!params.name && !params.description && !params.developerTeam)
        return res.status(500).send({ message: 'Debe llenar los datos necesarios' })

    project.projectOwner = projectOwner;
    project.name = params.name;
    project.description = params.description;
    project.developerTeam = params.developerTeam;

    project.save((err, storedProject) => {
        if (err)
            return res.status(500).send({ message: 'Error en la petición' });
        if (!storedProject)
            return res.status(404).send({ message: 'El proyecto no pudo ser guardado' });
        User.populate(storedProject, { path: 'projectOwner' }, (err, project) => {
            console.log([err, project]);
            if (err)
                return res.status(500).send({ message: 'Error en la petición' });
            if (!project)
                return res.status(404).send({ message: 'No se han podido obtener datos de integrantes' });
            Team.populate(project, { path: 'developerTeam' }, (err, project) => {
                console.log([err, project]);
                if (err)
                    return res.status(500).send({ message: 'Error en la petición' });
                if (!project)
                    return res.status(404).send({ message: 'No se han podido obtener datos de integrantes' });
                return res.status(200).send({ project: project });
            });
        });
    });
}

function editProject(req, res) {
    var params = req.body;
    var projectId = req.params.id;

    Project.findByIdAndUpdate(projectId, params, { new: true }, (err, updatedProject) => {
        if (err)
            return res.status(500).send({ message: 'Error en la petición' });
        if (!updatedProject)
            return res.status(500).send({ message: 'El proyecto no pudo ser actualizado' });
        User.populate(updatedProject, { path: 'projectOwner' }, (err, project) => {
            console.log([err, project]);
            if (err)
                return res.status(500).send({ message: 'Error en la petición' });
            if (!project)
                return res.status(404).send({ message: 'No se han podido obtener datos de integrantes' });
            Team.populate(project, { path: 'developerTeam' }, (err, project) => {
                console.log([err, project]);
                if (err)
                    return res.status(500).send({ message: 'Error en la petición' });
                if (!project)
                    return res.status(404).send({ message: 'No se han podido obtener datos de integrantes' });
                return res.status(200).send({ project: project });
            });
        });
    });
}

function getProjects(req, res) {
    var projectOwner = req.user.sub;

    Project.find({ 'projectOwner': projectOwner }).exec((err, projects) => {
        if (err)
            return res.status(500).send({ message: 'Error en la petición' });
        if (!projects) 
            return res.status(404).send({ message: 'No se han podido obtener los proyectos' });
        User.populate(projects, { path: 'projectOwner' }, (err, projects) => {
            console.log([err, projects]);
            if (err)
                return res.status(500).send({ message: 'Error en la petición' });
            if (!projects)
                return res.status(404).send({ message: 'No se han podido obtener datos de integrantes' });
            Team.populate(projects, { path: 'developerTeam' }, (err, projects) => {
                console.log([err, projects]);
                if (err)
                    return res.status(500).send({ message: 'Error en la petición' });
                if (!projects)
                    return res.status(404).send({ message: 'No se han podido obtener datos de integrantes' });
                return res.status(200).send({ projects: projects });
            });
        });
    });
}

function deleteProject(req, res) {
    var projectId = req.params.id;

    Project.findByIdAndDelete(projectId, (err, deletedProject) => {
        if (err)
            return res.status(500).send({ message: 'Error en la petición' });
        if (!deletedProject)
            return res.status(500).send({ message: 'El proyecto no pudo ser eliminado' });
        User.populate(deletedProject, { path: 'projectOwner' }, (err, project) => {
            console.log([err, project]);
            if (err)
                return res.status(500).send({ message: 'Error en la petición' });
            if (!project)
                return res.status(404).send({ message: 'No se han podido obtener datos de integrantes' });
            Team.populate(project, { path: 'developerTeam' }, (err, project) => {
                console.log([err, project]);
                if (err)
                    return res.status(500).send({ message: 'Error en la petición' });
                if (!project)
                    return res.status(404).send({ message: 'No se han podido obtener datos de integrantes' });
                return res.status(200).send({ project: project });
            });
        });
    })
}

function getProject(req, res) {
    var projectId = req.params.id;
    Project.findById(projectId, (err, project)=>{
        if (err) return res.status(500).send({ message: 'Error en la petición' });
        if (!project) return res.status(404).send({ message: 'No se ha podido obtener el proyecto' });
        return res.status(200).send({ project: project });

    })
}

module.exports = {
    addProject,
    editProject,
    getProjects,
    deleteProject,
    getProject
}
