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
      susie = require('susie'),
      vision = require('vision'),
      inert = require('inert');

server.connection({port: config.port});
var plugins = [
    {
        register: hapiHarvester,
        options: {
            adapter: adapter(config.connectionString),
            adapterSSE: adapterSSE(config.oplogConnectionString)
        }
    },
    susie,
    inert,
    vision,
    {
        register: require('hapi-swagger'),
        options: {
            info: {
                title: 'Feature Unlock API',
                version: '1.0.0'
            }
        }
    }
    ];
server.register(plugins
    , function () {
        var harvester = server.plugins['hapi-harvester'];
        server.start(() => {
            loadResources(server, harvester);
            console.log('Server running at:', server.info.uri);
        })
    });

function loadResources(server, harvester) {
    var models = require_dir(module, './models');
    _.each(models, model => {
        model(server);
    })
}