export PG_USER=webapp
export PG_HOST=ec2-3-69-43-70.eu-central-1.compute.amazonaws.com
export PG_PORT=5432
export PG_PASSWORD=Passw0rd
export ELASTICSEARCH_HOST=localhost
export ELASTICSEARCH_PORT=9200
export ELASTICSEARCH_USE_SSL=true
export ELASTICSEARCH_CA_CERTS=/etc/elasticsearch/certs/http_ca.crt
export ELASTICSEARCH_API_KEY_ID=pgsync
export ELASTICSEARCH_API_KEY=bjJiM2lvZ0J0Vm5ROVVCbWxNbnE6OVhlRWt4NWtRYjZpQmdwd0pjQVY0UQ==
pgsync -c schema.json