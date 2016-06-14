'use strict';
const 
    mongoose = require('mongoose'),
    log = require('./log'),
    config = require('../config'),
    Promise = require('bluebird'),
    Kafka = require('no-kafka'),
    producer = new Kafka.Producer({
        connectionString: config.kafkaUri
    }),
    durableMethods = [
        'post',
        'delete',
        'patch'
    ];

function storeEvent(server, event_collection, event_body) {
    log.debug('Creating event ' + event_collection + ' ' + event_body);
    const harvesterPlugin = server.plugins['hapi-harvester'];
    const event = new harvesterPlugin.adapter.models[event_collection](event_body);
    return event.save()
    .then(data => {
        log.debug(data);
        return data; 
    });
}

function broadcastEvent(event_collection, event_body) {
    return producer.init().then(() => {
        return producer.send({
            topic: event_collection,
            partition: 0,
            message: {
                //todo: make this failproof by using lodash to access the property
                key: event_body.attributes.key,
                value: JSON.stringify(event_body)
            }
        });
    })
    .then(function(result) {
        console.log(result);
    });
}

function createEvent(server, event_collection, event_body) {
    return Promise.all([ 
        storeEvent(server, event_collection, event_body),
        broadcastEvent(event_collection, event_body)
    ]);
}

module.exports.createEvent = createEvent;
module.exports.broadCastEvent = broadcastEvent;