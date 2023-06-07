#!/bin/bash
if ! command -v bootstrap &> /dev/null
then
    echo "bootstrap could not be found, please install it"
    exit
fi

if [ $# -ne 4 ]; then
    echo "Usage: bootstrap.sh <postgres username> <postgres password> <postgres hostname> <elasticsearch password>"
    exit 1
fi
PGUSER=$1
PGPASSWORD=$2
PGHOST=$3
ELASTICSEARCH_PASSWORD=$4

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
bootstrap -c ./schema.json