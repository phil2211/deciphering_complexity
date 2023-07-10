const { ApolloServer, gql } = require('apollo-server');
const elastic = require('@elastic/elasticsearch');
const pg = require('pg');

// Initialize the Elasticsearch client
const elasticClient = new elastic.Client({
    node: 'https://ec2-18-159-124-217.eu-central-1.compute.amazonaws.com:9200',
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        apiKey: "SHJLOGQ0Z0JUZkdEcVNPTW8zX1o6d2Q0ckdQS2ZRUENIQ293YlRoSVhCQQ=="
    }
});

// Initialize the PostgreSQL client
const pgClient = new pg.Client({
  host: 'ec2-3-69-43-70.eu-central-1.compute.amazonaws.com',
  port: 5432,
  user: 'webapp',
  password: 'Passw0rd',
  database: 'mycustomers',
});

pgClient.connect();

// Define your GraphQL schema
const typeDefs = gql`
  type Query {
    search(searchText: String!, startRow: Int!, endRow: Int!): SearchResult!
  }

  type Mutation {
    updateStreet(id: Int!, street: String): Customer
    updateCity(id: Int!, city: String): Customer
    updateCountry(id: Int!, country: String): Customer
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
  Mutation: {
    updateStreet: async (_, { id, street }) => {
      const result = await pgClient.query(`UPDATE customers SET street = $1 WHERE id = $2 RETURNING *`, [street, id]);
      return result.rows[0];
    },
    updateCity: async (_, { id, city }) => {
      const result = await pgClient.query(`UPDATE customers SET city = $1 WHERE id = $2 RETURNING *`, [city, id]);
      return result.rows[0];
    },
    updateCountry: async (_, { id, country }) => {
      const result = await pgClient.query(`UPDATE customers SET country = $1 WHERE id = $2 RETURNING *`, [country, id]);
      return result.rows[0];
    }
  },
  Query: {
    search: async (_, { searchText, startRow, endRow }) => {
      const query =
        searchText === "" ? {
          match_all: {}
        } :
        {
          bool: {
            should: [
              {
                multi_match: {
                  query: searchText,
                  type: "cross_fields",
                  operator: "and",
                  fields: ['lastname', 'firstname', 'profession', 'street', 'city', 'country']
                }
              },
              {
                nested: {
                  path: "contacts",
                  query: {
                    bool: {
                      should: [
                        {
                          match: {
                            "contacts.value": {
                              query: searchText,
                              fuzziness: "AUTO"
                          } }
                        },
                      ]
                    }
                  }
                }
              }
            ],
            minimum_should_match: 0
          }
        }
      
      const result = await elasticClient.search({
        index: 'mycustomers',
        from: startRow,
        size: endRow - startRow,
        query
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
