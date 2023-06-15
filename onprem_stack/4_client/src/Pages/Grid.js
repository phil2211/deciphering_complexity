import React, { useState, useEffect, Component } from "react";
import { AgGridReact } from "ag-grid-react";
import TextInput from "@leafygreen-ui/text-input";
import { debounce } from "lodash";
import Header from "../Components/Header";
import { createServerSideDatasource, updateField } from "../lib/graphql/gridDatasourse";
import apolloClientConsumer from "../lib/graphql/apolloClientConsumer";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";

const formatNumber = (value) => {
    return new Intl.NumberFormat('de-DE').format(value);
}

const Grid = ({ client }) => {
    const [totalRows, setTotalRows] = useState(0)
    const [searchText, setSearchText] = useState('');
    const [gridApi, setGridApi] = useState(null);

    const dbSetSearchText = debounce(setSearchText, 500);

    const handleUpdate = ({ oldValue, newValue, data, column }) => {
        console.log(oldValue, newValue, data, column);
        updateField({ client, id: data.id, value: newValue, valueField: column.colId });
    }
    
    const [columnDefs] = useState([
        { field: "id", cellRenderer: "agGroupCellRenderer" },
        { field: "lastname" },
        { field: "firstname" },
        { field: "profession" },
        { field: "street", editable: true, onCellValueChanged: handleUpdate },
        { field: "city", editable: true, onCellValueChanged: handleUpdate },
        { field: "country", editable: true, onCellValueChanged: handleUpdate }
    ]);

    const detailColumnDefs = [
        { field: "type" },
        { field: "value" },
        { field: "channel" },
    ]

    useEffect(() => {
        if (gridApi) {
            onGridReady(gridApi, searchText);
        }
    }, [searchText]);

    const onGridReady = async (params, searchText) => {
        setGridApi(params);
        params.api.sizeColumnsToFit();
        const datasource = createServerSideDatasource({ client, searchText })
        params.api.setServerSideDatasource(datasource);
    }

    const onModelUpdated = (params) => {
        setTotalRows(params.api.getDisplayedRowCount());
    }

    return (
        <>
            <Header />
            <div style={ {marginBottom: 10, width: 500} }>
                <TextInput
                    autoComplete="off"
                    aria-label="enter search text"
                    type="search"
                    placeholder="Search"
                    onChange={event => dbSetSearchText(event.target.value)}
                    />
            </div>
            <div         
                style={{ height: "calc(100vh - 280px)" }}
                className="ag-theme-alpine"
            >
                <AgGridReact
                    columnDefs={columnDefs}
                    onGridReady={onGridReady}
                    onModelUpdated={onModelUpdated}
                    onFilterChanged={() => gridApi.api.refreshServerSideStore()}
                    rowModelType="serverSide"
                    serverSideStoreType="partial"
                    cacheBlockSize={20}
                    maxBlocksInCache={5}
                    masterDetail={ true }
                    detailCellRendererParams={{
                        refreshStrategy: 'rows',
                        getDetailRowData: (params) => {
                            params.successCallback(() => {
                                return params.data.contacts;
                            })
                        },
                        detailGridOptions: {
                            getRowId: (params) => {
                                return params.data.number;
                            },  
                            columnDefs: detailColumnDefs
                        }
                    }}    
                />
            </div>
            <div style={{ margin: 10 }}>
            <p>{`Total Results: ${formatNumber(totalRows)}`}</p>
        </div>

        </>
    )
}

export default apolloClientConsumer(Grid);