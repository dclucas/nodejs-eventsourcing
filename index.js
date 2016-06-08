const Hapi = require('hapi'),
      server = new Hapi.Server({}),
      hapiHarvester = require('hapi-harvester'),
      adapter = hapiHarvester.getAdapter('mongodb'),
      adapterSSE = hapiHarvester.getAdapter('mongodb/sse'),
      config = require('./config')
      require_dir = require('require-directory'),
      _ = require('lodash'),
      events = require("events"),
      eventEmitter = new events(),
      Rx = require('rx'),
      EventSource = require('eventsource'),
      susie = require('susie'),
      vision = require('vision'),
      inert = require('inert'),
      log = require('./utils/log');

server.connection({port: config.port});
var plugins = [susie, inert, vision,
    {
        register: hapiHarvester,
        options: {
            adapter: adapter(config.connectionString),
            adapterSSE: adapterSSE(config.oplogConnectionString)
        }
    },
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
server.register(plugins, startServer);

function startServer() {
    server.start(() => {
        loadResources(server);
        log.info('Server running at:' + server.info.uri);
    })
}
function loadResources(server) {
    var models = require_dir(module, './models');
    _.each(models, model => {
        model(server);
    })
}