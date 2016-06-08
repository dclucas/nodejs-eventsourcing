'use strict';
var config = {};
config.connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/brandsdb';
config.oplogConnectionString = process.env.MONGODB_OPLOG_URI || 'mongodb://localhost:27017/local';
config.logstashHost = process.env.LOGSTASH_HOST || 'localhost';
config.logstashPort = process.env.LOGSTASH_PORT || '5000';
config.port = process.env.PORT || 2426;
module.exports = config;