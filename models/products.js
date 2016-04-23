'use strict';

var Types = require('joi');

module.exports = function (server) {
    const harvesterPlugin = server.plugins['hapi-harvester']

    const schema = {
		type: 'products',
		attributes: {
			description: Types.string().description('Product description')
		}/*,
		relationships: {
			brands: {type: 'brands'}
		}*/
	}

    harvesterPlugin.routes.all(schema).forEach(function (route) {
        server.route(route)
    })
}
