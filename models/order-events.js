'use strict';

var Types = require('joi');

module.exports = function (server) {
    const harvesterPlugin = server.plugins['hapi-harvester']

    const schema = {
        type: 'order_events',
        attributes: {
            kind: Types.string().description('Event kind').valid(['create', 'sent', 'processed', 'fulfilled', 'invoiced']).required(),
            eventDate: Types.date().required(),
            payload: Types.any()
        }
    };
    
    server.route(harvesterPlugin.routes['get'](schema));
    server.route(harvesterPlugin.routes['getById'](schema));
    server.route(harvesterPlugin.routes['getChangesStreaming'](schema));
}
