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
    search(searchText: String!, startRow: Int!, endRow: Int!): SearchResult!
  }

  type SearchResult {
    lastRow: Int
    rows: [Customer!]
  }

  type Customer {
    id: ID!
    lastname: String
    firstname: String
    profession: String
    street: String
    city: String
    country: String
    contacts: [Contact!]
  }

  type Contact {
    type: String
    value: String
    channel: String
  }
`;

// Define your resolvers
const resolvers = {
  Query: {
    search: async (_, { searchText, startRow, endRow }) => {
        const result = await client.search({
          index: 'mycustomers',
          from: startRow,
          size: endRow - startRow,
          query: {
            bool: {
              "should": [
                {
                  multi_match: {
                    query: searchText,
                    type: "cross_fields",
                    operator: "and",
                    fields: ['lastname', 'firstname', 'profession', 'street', 'city', 'country'],
                  }
                },
                {
                  match: {
                    "contacts.value": searchText
                  }
                }
              ]
            }
          }
        })

      console.log(result.hits.hits);
      return  {
        lastRow: result.hits.total.value,
        rows: result.hits.hits.map(hit => ({
          id: hit._id,
          lastname: hit._source.lastname,
          firstname: hit._source.firstname,
          profession: hit._source.profession,
          street: hit._source.street,
          city: hit._source.city,
          country: hit._source.country,
          contacts: hit._source.contacts
        }))
      }
    }
  }
};

// Initialize ApolloServer
const server = new ApolloServer({ typeDefs, resolvers });

// Start the server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
