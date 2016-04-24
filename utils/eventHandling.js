'use strict';

module.exports.createEvent = function (server, event_col, event_data) {
    const harvesterPlugin = server.plugins['hapi-harvester'];
    console.log(event_data);
}