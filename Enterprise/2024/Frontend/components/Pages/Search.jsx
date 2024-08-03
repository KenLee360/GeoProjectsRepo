/* eslint-disable react/jsx-key */
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {AgGridReact} from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";


function SearchPestEvents() {

    //Gets Data from API and sets it to events variable
    const [events, setEvents] = useState([]);

    //http://fsxsnpf0193.edc.ds1.usda.gov/per24/api/api/PestEvent/GetPestEvents --- This is the api URL on the server, won't work on local PC
    //https://localhost:7087/api/PestEvent/GetPestEvents -- only works on local PC, change before deployment
    useEffect(() => {
        fetch("https://localhost:7087/api/PestEvent/GetPestEvents")
            .then((response) => response.json())
            .then((data) => {
                setEvents(data)
            })
            .catch(error => {
                console.error("Couldn't Retrieve: ", error)
            });
    }, []);

    //Formats Data for table
    const exFi = events.map(({ affectedArea, counties, damageAgent, damageAgentCode, fsregionCode, hosts, isDeleted, lastEditedBy, lastEditedByName, lastEditedDate, narrative, pestEventId, recordType, reportDate, settings, submitter, submitterName, surveyMethods, surveyYear }) => ({
        affectedArea, counties, damageAgent, damageAgentCode, lastEditedBy, lastEditedByName, lastEditedDate, narrative, pestEventId, recordType, reportDate, submitter, submitterName, surveyYear,
        fsregionCode: ((recordType === 'National') ? 'N/A' : (fsregionCode === 9) ? 'NA' : (fsregionCode === 11) ? 'IITF' : fsregionCode),
        settings:((recordType === 'Source') ? settings.map(p => p.display) : 'N/A'),
        hosts: ((recordType === 'Source') ? hosts.map(p => p.display) : 'N/A'),
        surveyMethods: ((recordType === 'Source') ? surveyMethods.map(p => p.display) : 'N/A'),
        isDeleted: (recordType != 'Source' ? null : (isDeleted === true) ? 'Yes' : 'No'),
    }))

    //Builds Columns and sets defaults for Data Grid
    const cols = useMemo(() => {
        return [
            { headerName: 'Type', field: 'recordType', filter: true, checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, pinned: 'left' },
            { headerName: 'Damage Agent', field: 'damageAgent.display',filter: true},
            { headerName: 'FS Region', field: 'fsregionCode', filter: true },
            { headerName: 'Survey Year', field: 'surveyYear', filter: true },
            { headerName: 'Submitted By', field: 'submitterName', filter: true },
            { headerName: 'Pest Event Closure', field: 'isDeleted', filter: true },
            { headerName: 'Survey Method(s)', field: 'surveyMethods', filter: true },
            { headerName: 'Host(s)', field:'hosts', filter: true },
            { headerName: 'Setting(s)', field: 'settings', filter: true },
            {
                headerName: 'Actions',field:'pestEventId', suppressFilter: true, flex: 2, pinned: 'right',
                cellRenderer: (p) => {
                    return (
                        <ul className="usa-button-group" style={{ display: "inline-flex", height: '20px' }}>
                            <li className="usa-button-group__item">
                                <a href={`/per24/view/${p.value}`} className="usa-button__small usa-button--hover">View</a>
                            </li>
                            <li className="usa-button-group__item">
                                <a href={`/per24/edit/${p.value}`} className="usa-button__small">Edit</a>
                            </li>
                            <li className="usa-button-group__item">
                                <a href="#" className="usa-button__small" onClick={(() => console.log('Delete Button Clicked'))}>Delete</a>
                            </li>
                        </ul>
                    )
                }
            }
        ];
    }, []);

    const defaultDefs = useMemo(() => {
        return {
            floatingFilter: true,
            suppressMovable: true
        }
    }, []);

    //Handles Selection of Rows, Only returns rows that are displayed
    const gridRef = useRef();
    const SelectRows = useCallback(() => {
        var displayRows = []
        gridRef.current.api.forEachNodeAfterFilter(x => {
            displayRows.push(x.data.pestEventId)
        })
        var selectedRows = gridRef.current.api.getSelectedRows();
        selectedRows.forEach(s => {
            if (displayRows.includes(s.pestEventId)) {
                console.log(s)
            }
        })
    }, []);

    
    
    ModuleRegistry.registerModules([ClientSideRowModelModule]);

    return (
        <div className="grid-container" style={{ paddingTop: '20px',paddingBottom: '20px' }}>
            <h2>Existing Pest Event Records</h2>
            <button type="button" className="usa-button usa-button--base" onClick={SelectRows}>Create Report</button>
            <div className="ag-theme-alpine" style={{ height: '600px', width: '100%'}}>
                <AgGridReact ref={gridRef} rowData={exFi} columnDefs={cols} defaultColDef={defaultDefs}
                    pagination={true} paginationPageSize={25} paginationPageSizeSelector={[25, 50, 100, 500]}
                    rowSelection={"multiple"}
                    overlayLoadingTemplate={'<span>Loading</span>'} overlayNoRowsTemplate={'<span>Loading....</span>'} />   
            </div>
        </div>
    )
}
export default SearchPestEvents;