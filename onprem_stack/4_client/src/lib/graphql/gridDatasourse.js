import { gql } from "@apollo/client";
import { forEach } from "lodash";

export const updateAccount = ({ client, accountNumber, amount }) => {
  const query = {
    query: gql`
    mutation($accountNumber:String, $amount:Int) {
      updateAccountBalance(input: {
        accountNumber:$accountNumber,
        amount:$amount
      }) {
        aknowledge
      }
    }
    `,
    variables: {
      accountNumber,
      amount
    }
  };
  

  client.query(query)
    .then((res) => {
      console.log(res)
    })
    .catch(err => console.error(err));
}

export const createServerSideDatasource = ({ client, searchText="" }) => {
    return {
      getRows: ({ request, successCallback, failCallback }) => {
        //console.log(request);
        const { startRow, endRow, sortModel } = request;
            const query = { 
                query: gql`
                query Search(
                  $searchText: String!,
                  $startRow: Int!,
                  $endRow: Int!
                ) { 
                  search(
                    searchText: $searchText
                    startRow: $startRow
                    endRow: $endRow
                  ) {
                      lastRow
                      rows {
                        id
                        firstname
                        lastname
                        profession
                        street
                        city
                        country
                        contacts {
                          type
                          value
                          channel
                        }
                      }
                    }
                  }
                `,
              variables: {
                  startRow,
                  endRow,
                  searchText
                }
            };
            client.query(query)
              .then((res) => {
                console.log(res);
                return (
                  successCallback(res.data.search.rows, res.data.search.lastRow?res.data.search.lastRow:0)
                )
                
            })
            .catch(err => {
                console.error(err);
                failCallback();
            })
        }
    }
}