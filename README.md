# nodejs event sourcing

A sample PoC for event-sourcing goodness in node.js.

## Core concepts

* *event sourcing:* 
  - https://ookami86.github.io/event-sourcing-in-practice/
  - http://martinfowler.com/eaaDev/EventSourcing.html
* *log aggregation:*
  - https://en.wikipedia.org/wiki/Log_management 

## Components

This PoC runs on shoulders of multiple giants. In order to bind all the functionality together, a docker-compose file is used to describe the following services:
* API specific -- the idea is that each API in the ecosystem would have similar services:
  - web: the node.js API itself
  - mongo: the main DB store, belonging to the API
* Platform -- these services should be deployed (in clustered mode) only once, for all apps, as the greatest value-add lies in aggregating information across all of them:
  - elasticSearch - the one ~~ring~~ data store to rule them all. While each app has its own data store (eg. mongo in this PoC), ES will index metrics, logs and event data across all apps.
  - logstash - performs log collection, filtering and transformation.
  - kibana - visualization for all the data we collect.
  - kafka - a distributed commit log. Frequently used as a messaging channel. Commit logs are naturally event-sourced, so this is a match made in heaven.

* to-do -- these might be added at some moment
  - riemann
  - graphite
  - grafana

## Running it

`$ docker-compose up -d`

## Notes

* Nobody in their right mind would create such an infra for an app as small as this one
* Nobody in their right mind would run that infra on such a docker compose file
  - but... most services habe been set up in a way that is actually cluster friendly, so the _images_ could be used in a real prod situation 
