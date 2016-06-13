'use strict';
const 
    mongoose = require('mongoose'),
    log = require('./log'),
    config = require('../config');

function createEvent(server, event_collection, event_body) {
    log.debug('Creating event ' + event_collection + ' ' + event_body);
    const harvesterPlugin = server.plugins['hapi-harvester'];
    const event = new harvesterPlugin.adapter.models[event_collection](event_body);
    return event.save()
    .then(data => {
        log.debug(data);
        return data; 
    });
}

module.exports.createEvent = createEvent;