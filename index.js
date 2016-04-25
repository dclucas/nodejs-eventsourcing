var config = require('./config');

var harvesterApp = require('./app/api')(config);

module.exports = harvesterApp;