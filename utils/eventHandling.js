'use strict';
const 
    mongoose = require('mongoose'),
    log = require('./log'),
    config = require('../config'),
    Promise = require('bluebird'),
    kafka = Promise.promisifyAll(require('kafka-node')),
    Producer = kafka.Producer,
    client = new kafka.Client(config.zkUri),
    producer = new kafka.Producer(client);

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
producer.on('ready', function () {
    const payloads = [
         { topic: 'topic1', messages: 'hi', partition: 0 }
    ];

    producer.send(payloads, function (err, data) {
        console.log(data);
    });
});

producer.on('error', function(err) {
    log.error(err);
});

function broadcastEvent(server, event_collection, event_body) {
    /*
    return producer.init().then(() => {
        return producer.send({
            topic: event_collection,
            message: event_body
        });
    });
    */
    /*
    producer.on('ready', function () {
    producer.send(payloads, function (err, data) {
        console.log(data);
    });
    */
    return producer.onAsync('ready')
    .then(function() {
        return producer.sendAsync({
            topic: event_collection,
            messages: event_body
        })
    });
}

function createEvent(server, event_collection, event_body) {
    return Promise.all([ 
        storeEvent(server, event_collection, event_body),
        broadcastEvent(server, event_collection, event_body)
    ]);
}

module.exports.createEvent = createEvent;