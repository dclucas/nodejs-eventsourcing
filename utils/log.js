"use strict";
 
const 
    bunyan = require('bunyan'),
    bunyantcp = require('bunyan-logstash-tcp'),
    config = require('../config'),
    logger = bunyan.createLogger({
    name: 'example',
    streams: [{
        level: 'debug',
        stream: process.stdout
    },{
        level: 'debug',
        type: "raw",
        stream: bunyantcp.createStream({
            host: config.logstashHost,
            port: config.logstashPort
        })
    }],
    level: 'debug'
});

module.exports = logger;