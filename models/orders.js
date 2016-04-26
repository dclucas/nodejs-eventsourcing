'use strict';

const
    eh = require('../utils/eventHandling'),
    EventSource = require('eventsource'),
    Rx = require('rx'),
    Types = require('joi');

module.exports = function (server) {
    const harvesterPlugin = server.plugins['hapi-harvester']
    const schema = {
        type: 'orders',
        attributes: {
            status: Types.string().description('Order status').valid(['new', 'pending', 'processed', 'fulfilled', 'invoiced']).forbidden(),
            createdOn: Types.date().forbidden(),
            updatedOn: Types.date().forbidden(),
            totalPrice: Types.number().forbidden(),
            items: Types.array().items(Types.object({
                product_id: Types.string().required(),
                quantity: Types.number().integer().required(),
                price: Types.number().forbidden()
            }))
        }
    };
    
    server.route(harvesterPlugin.routes['get'](schema));
    server.route(harvesterPlugin.routes['getById'](schema));
    server.route(harvesterPlugin.routes['getChangesStreaming'](schema));
    
    var post = _.clone(harvesterPlugin.routes['post'](schema));
    //hack: this is chockfull of state. No biggie, since it's a PoC. But please don't do this in prod code.
    post.config.pre = [ { assign: 'enrichment', method: (request, reply) => {
        var attributes = request.payload.data.attributes;
        attributes.updatedOn = attributes.createdOn = new Date();
        _.each(attributes.items, e => {
            e.price = Math.floor((Math.random() * 10000) + 1) / 100;
        });
        attributes.totalPrice = _.reduce(attributes.items, (sum, i) => {
            return sum + (i.price * i.quantity);
        }, 0.0);
        return reply(request.payload);
    } } ];
    server.route(post);
    
    server.route({
        method: 'POST',
        path:'/orders/{id}/cancel', 
        handler: function (request, reply) {
            var id = encodeURIComponent(request.params.id);
            const data = {type: 'order_events', attributes: {
                kind: 'cancel', 
                eventDate: new Date(), 
                payload: request.payload
            }};
            return eh.createEvent(server, 'order_events', data)
            .then(reply('hello world'))
        }
    });
}