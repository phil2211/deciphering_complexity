const { ApolloServer, gql } = require('apollo-server');
const { Client } = require('@elastic/elasticsearch');

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

// Define your GraphQL schema
const typeDefs = gql`
  type Query {
    search(query: String!): [SearchResult!]!
  }

  type SearchResult {
    id: ID!
    lastname: String
    firstname: String
    profession: String
  }
`;

// Define your resolvers
const resolvers = {
  Query: {
    search: async (_, { query }) => {
        const result = await client.search({
          index: 'mycustomers',
          from: 0,
          size: 10,
          query: {
            bool: {
              "should": [
                {
                  "prefix": {
                    "firstname": {
                      "value": query
                    }
                  }
                },
                {
                  "prefix": {
                    "lastname": {
                      "value": query
                    }
                  }
                }
              ]
            }
          }
        })
        console.log(result.hits.hits);
      return result.hits.hits.map(hit => ({
            id: hit._id,
            lastname: hit._source.lastname,
            firstname: hit._source.firstname,
            profession: hit._source.profession
      }));
    }
  }
};

// Initialize ApolloServer
const server = new ApolloServer({ typeDefs, resolvers });

// Start the server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
