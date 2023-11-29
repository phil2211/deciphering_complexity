#!/bin/bash
# Load test data into the database
# This script assumes that you have installed the mgeneratejs tool
#
# Usage: loadTestdata.sh <username> <password> <clusterId>
if [ $# -ne 3 ]; then
    echo "Usage: loadTestdata.sh <username> <password> <clusterId>"
    exit 1
fi
USER=$1
PW=$2
CLUSTERID=$3
mgeneratejs -n 10000 < testData/customerData.json | mongoimport -u $USER -p $PW -c MyCustomers mongodb+srv://atlasstackdemo.$CLUSTERID.mongodb.net/MyCustomers