import React from "react";
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";

const createRealmApolloClient = () => {
    const link = new HttpLink({
        uri: `http://localhost:4000/`,
        fetch: async (uri, options) => {
            return fetch(uri, options);
        }
    });

    const defaultOptions = {
        watchQuery: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore',
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
      }

    const cache = new InMemoryCache();
    return new ApolloClient({ link, cache, defaultOptions });
}

const MyApolloProvider = ({ children }) => {
    const [client, setClient] = React.useState(createRealmApolloClient());

    React.useEffect(() => {
        setClient(createRealmApolloClient());
    }, []);

    return <ApolloProvider client={client}>{ children }</ApolloProvider>
}

export default MyApolloProvider;