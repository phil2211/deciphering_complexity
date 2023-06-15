#!/bin/bash
if ! command -v pgsync &> /dev/null
then
    echo "pgsync could not be found, please install it"
    exit
fi

if [ $# -ne 4 ]; then
    echo "Usage: pgsync.sh <postgres username> <postgres password> <postgres hostname> <elasticsearch password>"
    exit 1
fi
PGUSER=$1
PGPASSWORD=$2
PGHOST=$3
ELASTICSEARCH_PASSWORD=$4

curl -k -X DELETE "https://elastic:${ELASTICSEARCH_PASSWORD}@localhost:9200/mycustomers?pretty" -H 'Content-Type: application/json'
curl -k -X PUT "https://elastic:${ELASTICSEARCH_PASSWORD}@localhost:9200/mycustomers?pretty" -H 'Content-Type: application/json' -d @mappings.json
rm -f ./.mycustomers_mycustomers
export PG_USER=$PGUSER
export PG_HOST=$PGHOST
export PG_PORT=5432
export PG_PASSWORD=$PGPASSWORD
export ELASTICSEARCH_HOST=localhost
export ELASTICSEARCH_PORT=9200
export ELASTICSEARCH_USE_SSL=true
export ELASTICSEARCH_CA_CERTS=/etc/elasticsearch/certs/http_ca.crt
export ELASTICSEARCH_USER=elastic
export ELASTICSEARCH_PASSWORD=$ELASTICSEARCH_PASSWORD
pgsync -c ./schema.json --daemon