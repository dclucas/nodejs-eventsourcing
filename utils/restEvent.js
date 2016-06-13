"use strict";
 
const 
    bunyan = require('bunyan'),
    bunyantcp = require('bunyan-logstash-tcp'),
    config = require('../config'),
    logger = bunyan.createLogger({
        name: 'rest-entry',
        streams: [{
            stream: process.stdout
        },{
            type: "raw",
            stream: bunyantcp.createStream({
                host: config.logstashHost,
                port: config.logstashPort
            })
        }],
        level: 'info'
    });

function extractMetrics(request) {
    // todo: convert to lodash mapping
    const response = request.response;
    const id = _.get(response, 'source.data.id');
    return {
        method: request.method,
        url: request.url.path,
        client_id: undefined,
        user_id: undefined,
        received: request.info.received,
        resource_id: id,
        statusCode: response.statusCode,
        responded: request.info.responded,
        route: _.replace(request.url.path, id, '{id}') 
    };
}

function publish(request) {
    logger.info(extractMetrics(request));
}

module.exports.publish = publish;