'use strict'

const { Client } = require('@elastic/elasticsearch')
// Initialize the Elasticsearch client
const client = new Client({
    node: 'https://ec2-18-159-124-217.eu-central-1.compute.amazonaws.com:9200',
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        apiKey: "SHJLOGQ0Z0JUZkdEcVNPTW8zX1o6d2Q0ckdQS2ZRUENIQ293YlRoSVhCQQ=="
    }
});

async function run () {
  // Let's search!
  const result = await client.search({
    index: 'search-customers',
    query: {
      match: {
        public_accounts_description: 'hot'
      }
    }
  })

  console.log(result.hits.hits)
}

run().catch(console.log)