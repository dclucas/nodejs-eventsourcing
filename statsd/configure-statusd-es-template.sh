curl -XPUT $ES_HOST:$ES_PORT/_template/statsd-template -d @statsd-template.json
curl -XDELETE $ES_HOST:$ES_PORT/statsd-*