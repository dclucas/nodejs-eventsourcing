const Hapi = require('hapi'),
    hapiHarvester = require('./hapi-harvester'),
    config = require('./config')
    require_dir = require('require-directory'),
    _ = require('underscore'),
    adapter = hapiHarvester.getAdapter('mongodb'),
    server = new Hapi.Server({}),
    mongoose = require('mongoose'),
    events = require("events"),
    eventEmitter = new events();

mongoose.connect(config.connectionString);
eventEmitter.on('promotion', function (body) { storeEvent('promotion', body) });
eventEmitter.on('promotion', aggregatePromotion);

var promotionEvent = mongoose.model('promotionEvents', { id: String });
var eventTypes = {'promotion': promotionEvent};

server.connection({port: config.port});
server.register([ //{register: require('hapi-swagger'), options: {apiVersion: require('./package.json').version}},
                  { register: hapiHarvester, options: {adapter: adapter({mongodbUrl: config.connectionString}) }}]
    , function () {
        var harvester = server.plugins['hapi-harvester'];
        server.start(() => loadResources(server, harvester))
    });

server.route({
   method: 'POST',
   path:'/brands/{id}/promote', 
   handler: function (request, reply) {
       var id = encodeURIComponent(request.params.id)
       propagateEvent('promotion', {'id': id});
       return reply('hello world');
   }
});

function loadResources(server, harvester) {
    var models = require_dir(module, './models');
    _.map(Object.keys(models), function(model){
        server.route(models[model](harvester));
    });
}

function storeEvent(eventType, body) {
    var model = eventTypes[eventType];
    console.log(model);
    var event = new model(body);
    event.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('ok');
      }
    });
}

function propagateEvent(eventType, eventBody) {
    eventEmitter.emit(eventType, eventBody);
}

function aggregatePromotion(body) { 
    var brands = mongoose.model('brands');
    return brands.findOneAndUpdate(body.id, {$set: {'attributes.promoted': true }})
    .then(res => {console.log(res);})
    .catch(error => {console.log(error);});
}