'use strict';

const Types = require('joi');

module.exports = function (server) {
    const harvesterPlugin = server.plugins['hapi-harvester']
    const schema = {
        type: 'products',
        attributes: {
            name: Types.string().required(),
            price: Types.number().required()
        }
    };
    
    server.route(harvesterPlugin.routes['get'](schema));
    server.route(harvesterPlugin.routes['getById'](schema));
    server.route(harvesterPlugin.routes['post'](schema));
    server.route(harvesterPlugin.routes['getChangesStreaming'](schema));
}