#Check all dependencies
if ! command -v atlas &> /dev/null
then
    echo "atlas could not be found, please install it"
    exit
fi

if ! command -v appservices &> /dev/null
then
    echo "appservices could not be found, please install it"
    exit
fi

if ! command -v npm &> /dev/null
then
    echo "npm could not be found, please install it"
    exit
fi

if ! command -v mgeneratejs &> /dev/null
then
    echo "mgeneratejs could not be found, please install it"
    exit
fi

#Create Atlas Project
atlas auth login -P AtlasStack && \
atlas projects create AtlasStack -P AtlasStack && \
atlas config set -P AtlasStack project_id `atlas project ls -P AtlasStack | grep AtlasStack | awk '{ print $1 }'` && \
atlas quickstart --skipMongosh --skipSampleData --provider AWS --region EU_CENTRAL_1 --tier M0 --username admin --password Passw0rd --accessListIp "0.0.0.0/0" --clusterName AtlasStackDemo -P AtlasStack --force && \
sh testData/loadTestdata.sh admin Passw0rd $(atlas cluster connectionstrings describe AtlasStackDemo -P AtlasStack | grep "mongodb+srv" | awk -F. '{print $2}') && \
atlas clusters search indexes create -P AtlasStack -f "testData/AtlasSearchDefinitions/mappings.json" --clusterName AtlasStackDemo && \
atlas project apiKeys create --desc appservices --role GROUP_OWNER -P AtlasStack > AtlasAPIKeys.txt && \
appservices login --api-key $(cat AtlasAPIKeys.txt | grep "Public API Key" | awk '{ print $4 }') --private-api-key $(cat AtlasAPIKeys.txt | grep "Private API Key" | awk '{ print $4 }') -y --profile AtlasStack && \
appservices push --project `atlas project ls -P AtlasStack | grep AtlasStack | awk '{ print $1 }'` --local "backend" --include-package-json -y --profile AtlasStack && \
echo "REACT_APP_REALMAPP="$(appservices apps list --profile AtlasStack | grep atlasdemoapp | awk '{print $1}') > frontend/.env.local && \
cd frontend && npm install && npm start