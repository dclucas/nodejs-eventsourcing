'use strict';
const 
    Joi = require('joi'),
    _ = require('lodash'),
	model = {
        type: 'orders',
        attributes: {
            status: Joi.string().description('Order status').valid(['new', 'pending', 'processed', 'fulfilled', 'invoiced']).forbidden(),
            createdOn: Joi.date().forbidden(),
            updatedOn: Joi.date().forbidden(),
            totalPrice: Joi.number().forbidden(),
            items: Joi.array().items(Joi.object({
                product_id: Joi.string().required(),
                quantity: Joi.number().integer().required(),
                price: Joi.number().forbidden()
            }))
        }
    }

module.exports = function (harvesterApp) {
    var post = _.clone(harvesterApp.routes['post'](model));
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
    
	return [harvesterApp.routes['get'](model),
			harvesterApp.routes['getById'](model),
            post,
			harvesterApp.routes['patch'](model),
			harvesterApp.routes['delete'](model)]
}