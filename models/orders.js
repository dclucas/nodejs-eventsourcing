'use strict';
var Joi = require('joi'),
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
	return [harvesterApp.routes['get'](model),
			harvesterApp.routes['getById'](model),
			harvesterApp.routes['post'](model),
			harvesterApp.routes['patch'](model),
			harvesterApp.routes['delete'](model)]
}