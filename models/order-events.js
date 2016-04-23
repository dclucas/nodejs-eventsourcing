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
    
    const source = new EventSource(server.info.uri + '/orders/changes/streaming')
    Rx.Observable.fromEvent(source, 'orders_i')
    .subscribe((e) => {
        const harvesterPlugin = server.plugins['hapi-harvester'];
        const data = {type: 'order_events', attributes: {
            kind: 'create', 
            eventDate: new Date(), 
            payload: e.data
        }};
        const ev = new harvesterPlugin.adapter.models.order_events(data);
        ev.save()
        .then(data => {
            source.close();    
        });        
    });
}
