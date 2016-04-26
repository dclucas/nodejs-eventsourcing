'use strict';
var mongoose = require('mongoose'),
    config = require('../config');

module.exports.createEvent = function (server, event_collection, event_body) {
    console.log('Creating event ' + event_collection + ' ' + event_body);
    const harvesterPlugin = server.plugins['hapi-harvester'];
    const event = new harvesterPlugin.adapter.models[event_collection](event_body);
    return event.save()
    .then(data => {
        console.log(data);
        return data; 
    });
}