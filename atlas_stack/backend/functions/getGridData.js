exports = async ({startRow, endRow, searchText}) => {
  const isEmpty = require("lodash/isEmpty");
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("MyCustomers").collection("MyCustomers");
  
  const agg = [];
  
  if(!isEmpty(searchText)) {
    return await collection.aggregate(context.functions.execute("getEnhancedSearchStage", {searchText, startRow, endRow})).next();
  }
  
  agg.push({
    $facet: {
      rows: [{"$skip": startRow?startRow:0}, {"$limit": endRow-startRow?endRow-startRow:2000}],
      rowCount: [{$count: 'lastRow'}]
    }
  });
  
  agg.push({
    $project: {
      rows: 1,
      query: JSON.stringify(agg, null, ' '),
      lastRow: {"$ifNull": [{$arrayElemAt: ["$rowCount.lastRow", 0]}, 0]}
    }
  });

  return await collection.aggregate(agg).next();
}