exports = ({searchText, startRow, endRow}) => {
  const split = require("lodash/split");
  const trim = require("lodash/trim");

  const tSearchText = trim(searchText);
  const aSearchText = split(tSearchText, ' ', 5);
  
  const agg =  [
    {$search: {
       index: "default",
       compound: {
         should: [
          {autocomplete: {
            query: tSearchText,
            path: "lastname",
            fuzzy: {
              maxEdits: 1
            }
          }},
          {autocomplete: {
            query: tSearchText,
            path: "firstname"
          }},
          {autocomplete: {
            query: tSearchText,
            path: "profession"
          }},
          {autocomplete: {
            query: tSearchText,
            path: "street"
          }},
          {autocomplete: {
            query: tSearchText,
            path: "city"
          }},
          {autocomplete: {
            query: tSearchText,
            path: "country"
          }},
          {embeddedDocument: {
            path: "contacts",
            operator: {
              text: {
                query: tSearchText,
                path: "contacts.valuer"
              }
            }
          }}
        ],
        minimumShouldMatch: aSearchText.length
       }
    }}];
    
    agg.push(
      {$set: {
        score: {$meta: 'searchScore'}
      }}  
    );
    
    agg.push(
      { $facet: {
        rows: [{ $skip: startRow }, { $limit: endRow-startRow }],
        lastRow: [{$replaceWith: "$$SEARCH_META"},{$limit: 1}]
      }}, 
    );
    
    agg.push({$set: {
       lastRow: {"$ifNull": [{$arrayElemAt: ["$lastRow.count.lowerBound", 0]}, 0]},
       query: JSON.stringify(agg, " ", 2),
    }});
    
    return agg;
}