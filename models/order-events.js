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
        },
        relationships: {
            order: 'orders'
        }
    };
    
    server.route(harvesterPlugin.routes['get'](schema));
    server.route(harvesterPlugin.routes['getById'](schema));
    server.route(harvesterPlugin.routes['getChangesStreaming'](schema));

    const source = new EventSource(server.info.uri + '/orders/changes/streaming')
    Rx.Observable.fromEvent(source, 'orders_i')
    .subscribe((e) => {
        const harvesterPlugin = server.plugins['hapi-harvester'];
        const eventData = JSON.parse(e.data);
        const payload = { 
            type: 'order_events', 
            attributes: {
                kind: 'create', 
                eventDate: new Date(),
                payload: eventData 
            },
            relationships: {
                order: { data: {
                    type: 'orders',
                    id: eventData.id
                }}    
            }};
        const ev = new harvesterPlugin.adapter.models.order_events(payload);
        ev.save()
        .then(data => {
            source.close();    
        });        
    });
}
