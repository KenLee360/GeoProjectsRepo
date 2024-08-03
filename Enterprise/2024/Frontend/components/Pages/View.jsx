/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDamageAgent } from "../../services/References";
import axios from 'axios';
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/Mapview";
import Modal from "react-bootstrap/Modal";
import QuillEditor from "../Common/QuillEditor";
import ViewTable from "../Create/components/CountyViewTable";
import '../Create/CreateGeography.css';
import useGetPestEventDetails from "../../hooks/useGetPestEventDetails";

function ViewEvent() {

    const { pestEventId } = useParams();
    const [key, setKey] = useState(1);
    const [mapShow, setMapShow] = useState(false);
    const [tableShow, setTableShow] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [damageAgent, setDamageAgent] = useState("");
    //Quill Editor Refs
    const affectedAreaQuillRef = useRef();
    const narrativeQuillRef = useRef();

    const {
        event,
        damageAgentCode,
        methods,
        hosts,
        closure,
        settings,
        counties
    } = useGetPestEventDetails(pestEventId);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAgent = async () => {
            if (damageAgentCode) {
                try {
                    const da = await getDamageAgent(damageAgentCode);
                    if (da) {
                        const displayName = da.displayName;
                        setDamageAgent(displayName);
                    }
                } catch (error) {
                    console.error("Failed to fetch damage agent", error);
                }
                
            }
        };
        fetchAgent();
    }, [damageAgentCode])

    // This should be extracted out into its own custom function in the services/ dir
    function CopyEvent() {
        //Check for WKT field in Counties Array

        //Save to DB, create new record
        //http://fsxsnpf0193.edc.ds1.usda.gov/per24/api/api/PestEvent -- URL for Deployment
        //https://localhost:7087/api/PestEvent -- URL for local machine
        axios.post(`http://fsxsnpf0193.edc.ds1.usda.gov/per24/api/api/PestEvent`, {
            hosts: hosts,
            settings: settings,
            surveyMethods: methods,
            counties: counties,
            damageAgent: event.damageAgent,
            reportDate: new Date(),
            surveyYear: event.surveyYear,
            narrative: event.narrative,
            affectedArea: event.affectedArea,
            submitter: "kennethlee@sda.gov",
            submitterName: "Kenneth Lee",
            lastEditedBy: "kennethlee@usda.gov",
            lastEditedByName: "Kenneth Lee",
            lastEditedDate: new Date(),
            recordType: "Source",
            damageAgentCode: event.damageAgentCode,
            fsregionCode: event.fsregionCode,
            isDeleted: false
        }).then(() => {
            //If successful, displays a alert letting the user know it was successful and redirects to search page
            setSubmitted(true);
            setTimeout(() => {
                navigate('/search')
            }, 2000)
        }).catch(error => {
            console.error("Error Create Pest Event", error);
        });
    }

    // MapPopup should be extracted to its own component in its own file
    //--------------------------------Map and Table------------------------------
    function MapPopup(props) {
        const mapDiv = useRef(null);

        useEffect(() => {

            if (mapDiv.current) {
                const map = new Map({
                    basemap: "topo"
                });

                const view = new MapView({
                    map: map,
                    container: mapDiv.current,
                    zoom: 4,
                    center: [-79.01, 35.73]
                });

            }
        }, []);

        return (
            <div>
                <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Title id="centered-modal-title-vcenter">Selected Counties</Modal.Title>
                    <Modal.Body><div className="mapDiv" ref={mapDiv} /></Modal.Body>
                    <Modal.Footer>
                        <button className="usa-button" onClick={props.onHide}>Close Map</button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

    return (
        <div className="grid-container">
            <br />
            <h2>View Pest Event (Read-Only) - {event.surveyYear}, Region {event.fsregionCode == 9 ? 'N/A' : event.fsregionCode == 11 ? 'IITF' : event.fsregionCode}, {damageAgent}</h2>
            <button className="usa-button usa-button--base" onClick={() => CopyEvent()}>Copy Pest Event</button>
            {submitted && <div className="usa-alert">Pest Event Created Successfully</div>}
            <br />
            <br />
            <div className="fsdp-tabs">
                <div role="tablist" aria-label="FSDP Tabs">
                    <button className="usa-button" role="tab" aria-selected={key === 1 ? "true" : "false"} aria-controls="panel-4" id="tab-4" tabIndex="0" onClick={() => setKey(1)}>
                        General
                    </button>
                    <button className="usa-button" role="tab" aria-selected={key === 2 ? "true" : "false"} aria-controls="panel-5" id="tab-5" tabIndex="0" onClick={() => setKey(2)}>
                        Geography
                    </button>
                    <button className="usa-button" role="tab" aria-selected={key === 3 ? "true" : "false"} aria-controls="panel-6" id="tab-6" tabIndex="0" onClick={() => setKey(3)}>
                        Narrative
                    </button>
                </div>
                <div style={key === 1 ? { display: 'flex' } : { display: 'none' }} id="panel-4" role="tabpanel" tabIndex="0" aria-labelledby="tab-4">
                <div className="grid-container grid-col-6">
                    <div className="grid-row grid-gap">
                        <div className="mobile-lg:grid-col-6">
                            <label className="usa-label" htmlFor="year">Survey Year:</label>
                            <input className="usa-input" value={event.surveyYear || ""} disabled />
                        </div>
                        <div className="mobile-lg:grid-col-6">
                            <label className="usa-label" htmlFor="fsregion">FS Region:</label>
                            <input className="usa-input" value={event.fsregionCode || ""} disabled />                              
                        </div>
                    </div>
                    <div>
                        <label className="usa-label" htmlFor="damageAgent">Damage Agent:</label>
                            <input className="usa-input" value={damageAgent || ""} disabled />                                               
                    </div>
                    <br />
                    <div className="checkbox_container">
                        <input type="checkbox" className="large_checkbox" checked={event.isDeleted ?? false} id="closure" readOnly/>
                        <label className="checkbox_label" htmlFor="closure">Pest Event Closure</label>
                    </div>
                    <div>
                        <label className="usa-label" htmlFor="surveyMethod" hidden={closure == true}>Survey Method(s):</label>
                        <select className="selector" multiple value={methods.display} disabled hidden={closure == true}>
                            {methods.map(x =>
                                <option key={x.childID}>{x.display}</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label className="usa-label" htmlFor="hosts" hidden={closure == true}>Host(s):</label>
                        <select className="selector" multiple value={hosts.display} disabled hidden={closure == true}>
                            {hosts.map(x =>
                                <option key={x.childID}>{x.display}</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label className="usa-label" htmlFor="settings" hidden={closure == true}>Setting(s):</label>
                        <select className="selector" multiple value={settings.display} disabled hidden={closure == true}>
                            {settings.map(x =>
                                <option key={x.childID}>{x.display}</option>
                            )}
                        </select>
                    </div>
                </div>
                    <br />
                    <br />
                </div>
                <div style={key === 2 ? { display: 'flex' } : { display: 'none' }} id="panel-5" role="tabpanel" tabIndex="-1" aria-labelledby="tab-5">
                    <div className="grid-container grid-col-4">
                        <div className="usa-button_group" style={{ display: "flex",flexDirection: "column", border: "3px solid black", padding: "10px" }}>
                            <button className="btn btn-dark" type="button" onClick={() => setMapShow(true)} disabled={closure == true}>Counties/Equivalents Map</button>
                            <MapPopup show={mapShow} onHide={() => setMapShow(false)} />
                            <button className="btn btn-secondary" type="button" onClick={() => setTableShow(true)} disabled={closure == true}>Counties/Equivalents Table</button>
                            <ViewTable show={tableShow} onHide={() => setTableShow(false)} initial={counties} />
                        </div>
                    </div>
                </div>
                <div style={key === 3 ? { display: 'flex' } : { display: 'none' }} id="panel-6" role="tabpanel" tabIndex="0" aria-labelledby="tab-6">
                    <div className="grid-container grid-col-6">
                        {/*Editor for the Affected Area*/}
                        <label className="usa-label" htmlFor="affectedArea">Affected Area</label>
                        <QuillEditor
                            ref={affectedAreaQuillRef}
                            readOnly={true}
                            initialValue={event.affectedArea}
                            onTextChange={() => {}} //noop
                            className='quill'
                            id='affectedArea'
                            rows='5'
                        />
                        {/*Editor for the Narrative*/}
                        <label className="usa-label" htmlFor="narrative">Narrative</label>
                        <QuillEditor
                            ref={narrativeQuillRef}
                            readOnly={true}
                            initialValue={event.narrative}
                            onTextChange={() => {}} //noop
                            className='quill'
                            id='narrative'
                            rows='5'
                        />
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ViewEvent
