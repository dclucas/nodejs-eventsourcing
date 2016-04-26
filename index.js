const Hapi = require('hapi'),
      hapiHarvester = require('hapi-harvester'),
      config = require('./config')
      require_dir = require('require-directory'),
      _ = require('underscore'),
      adapter = hapiHarvester.getAdapter('mongodb'),
      adapterSSE = hapiHarvester.getAdapter('mongodb/sse'),
      server = new Hapi.Server({}),
      events = require("events"),
      eventEmitter = new events(),
      Rx = require('rx'),
      EventSource = require('eventsource'),
      susie = require('susie');

server.connection({port: config.port});
server.register([
    {
        register: hapiHarvester,
        options: {
            adapter: adapter(config.connectionString),
            adapterSSE: adapterSSE(config.oplogConnectionString)
        }
    },
    susie
    ]
    , function () {
        var harvester = server.plugins['hapi-harvester'];
        server.start(() => {
            loadResources(server, harvester);
            console.log('Server running at:', server.info.uri);
        })
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
    _.each(models, model => {
        model(server);
    })
}