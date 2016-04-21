'use strict';
var config = {};
config.connectionString = process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/brandsdb';
config.port = process.env.PORT || 2426;
module.exports = config;