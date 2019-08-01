'user strict'

var Notification = require('../models/notification');

function createNotification(req, res) {
    var params = req.body;
    var notification = new Notification();
    if (params.to && params.title && params.description) {
        notification.from = req.params.sub;
        notification.to = params.to;
        notification.title = params.title;
        notification.description = params.description;
        notification.checked = false;
        notification.answered = false;

        Notification.findOne({$and: [{from: notification.from}, {to: notification.to}, {title: notification.title}, {description: notification.description}]}, (err, previousNotification) =>{
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if (!previousNotification){
                notification.save((err, saved)=>{
                    if(err) return res.status(500).send({message: 'Error en la peticion'});
                    if(!saved) return res.status(404).send({message: 'No se ha podido enviar la notificacion'});
                    return res.status(200).send({notification: saved});
                });
            }else{
                console.log(previousNotification);
                previousNotification.checked = false;
                previousNotification.answered = false;
                previousNotification.save((err, saved) => {
                    if (err) return res.status(500).send({ message: 'Error en la peticion' });
                    if (!saved) return res.status(404).send({ message: 'No se ha podido enviar la notificacion' });
                    return res.status(200).send({ notification: saved });
                });
            }
        })

    } else return res.status(404).send({ message: 'Debe rellenar todos los datos' })
}

function updateNotification(req, res){
    var notificationId = req.params.id;
    var params = req.body;
    delete params.to;
    delete params.from;
    delete params.title;
    delete params.description;
    Notification.findByIdAndUpdate(notificationId, params, {new: true}, (err, updatedNotification)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!updatedNotification) return res.status(404).send({message: 'No se ha podido contestar la notificacion'});
        return res.status(200).send({notification: updateNotification});
    });
}

function getNotification(req, res) {
    var notificationId = req.params.id;
    Notification.findById(notificationId, (err, notification)=>{
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!notification) return res.status(404).send({ message: 'No se han podido obtener los detalles de la notificacion' });
        return res.status(200).send({ notification: notification });
    })
}

function getNotifications(req, res) {
    var userId = req.user.sub;

    Notification.find({to: userId}, (err, notifications)=>{
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!notifications) return res.status(404).send({ message: 'No se han podido obtener las notificaciones' });
        return res.status(200).send({ notifications: notifications });
    })
}

function count(userId) {
    var notifications = 0;
    Notification.find({to: userId, checked: false}, (err, notificationsFound)=>{
        if(notificationsFound) {
            notifications = notificationsFound.length;
            return notifications;
        }
    });
}

module.exports = {
    createNotification,
    updateNotification,
    getNotification,
    getNotifications,
    count
}