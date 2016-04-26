'use strict';

const Types = require('joi');

module.exports = function (server) {
    const harvesterPlugin = server.plugins['hapi-harvester']
    const schema = {
        type: 'features',
        attributes: {
            kind: Types.string().valid('subscription', 'upgrade').required().description('Determines whether it is a feature activation, subscription, upgrade'),
            licenseModel: Types.string().valid('trial', 'paid').required().description('Indicates whether this is a trial or paid license'),
            activationModel: Types.string().valid('oneTime', 'renewable').required().description('Indicates whether this feature can be renewed or is a one time activation'),
            status: Types.string().valid('Active', 'Inactive').description('Describes the current feature status'),
            metaTags: Types.string().description('Metadata about the feature not represented by other attributes'),
            vendor: Types.string().required().description('The vendor who provides the service'),
            partNumber: Types.string().required().description('Part number for this feature'),
            vendorPartNumber: Types.string().description('Vendor part number for this feature'),
            subscriptionDuration: Types.number().description('Numeric value, indicating for how long the feature will be live, once activated'),
            durationUnit: Types.string().valid('year','month','day','engineHours').description('enum, indicating which unit (years, days, engine hours) is used to control duration'),
            sortOrder: Types.number().integer().required().description('Indicates the order partNumbers must be purchased'),
            physicalPart: Types.boolean().required().description('Identifies if the part is physical'),
            resendActivation: Types.boolean().required().description('Identifies whether the part allows resend activation')
        }
    };
    
    server.route(harvesterPlugin.routes['get'](schema));
    server.route(harvesterPlugin.routes['getById'](schema));
    server.route(harvesterPlugin.routes['post'](schema));
    server.route(harvesterPlugin.routes['getChangesStreaming'](schema));
    
    // var post = _.clone(harvesterPlugin.routes['post'](schema));
    // //hack: this is chockfull of state. No biggie, since it's a PoC. But please don't do this in prod code.
    // post.config.pre = [ { assign: 'enrichment', method: (request, reply) => {
    //     var attributes = request.payload.data.attributes;
    //     attributes.updatedOn = attributes.createdOn = new Date();
    //     _.each(attributes.items, e => {
    //         e.price = Math.floor((Math.random() * 10000) + 1) / 100;
    //     });
    //     attributes.totalPrice = _.reduce(attributes.items, (sum, i) => {
    //         return sum + (i.price * i.quantity);
    //     }, 0.0);
    //     return reply(request.payload);
    // } } ];
    // server.route(post);
}