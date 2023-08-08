import React from "react";
import Grid from "./Pages/Grid";
import MyApolloProvider from "./lib/graphql/apolloClient";
import { LicenseManager } from "ag-grid-enterprise";
import './styles.css';

LicenseManager.setLicenseKey(process.env.REACT_APP_AGGRID);

const App = () => {
  return (
    <MyApolloProvider>
      <Grid />
    </MyApolloProvider>
  );
}

export default App;