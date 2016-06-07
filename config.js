'use strict';
var config = {};
config.connectionString = process.env.MONGODB_URI 
    || 'mongodb://localhost:27017/brandsdb';
config.oplogConnectionString = process.env.MONGODB_OPLOG_URI 
    || 'mongodb://localhost:27017/local';
config.port = process.env.PORT || 2426;
module.exports = config;