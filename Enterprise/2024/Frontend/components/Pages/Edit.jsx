/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/Mapview";
import Modal from "react-bootstrap/Modal";
import {
    getRegions,
    getDamageAgents,
    getDamageAgent,
    getSurveyMethods,
    getHosts,
    getSettings,
    getCounties
} from "../../services/References";
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import MultiSelect from "../Create/components/MultiSelect";
import TypeAhead from "../Create/components/TypeAhead";
import CountyTable from "../Create/components/CountyTable";
import '../Create/components/MultiSelect.css';
import '../Create/CreateGeography.css';
import QuillEditor from "../Common/QuillEditor";
import { checkQuillContent } from '../../utils/quillUtils';

export default function EditEvent() {

    const { pestEventId } = useParams();
    const [event, setEvent] = useState({});
    const [agent, setAgent] = useState('');
    const [year, setYear] = useState('');
    const [fsreg, setFSReg] = useState('');
    const [methods, setMethods] = useState([]);
    const [hosts, setHosts] = useState([]);
    const [settings, setSettings] = useState([]);
    const [counties, setCounties] = useState([]);
    const [key, setKey] = useState(1);
    const [mapShow, setMapShow] = useState(false);
    const [tableShow, setTableShow] = useState(false);
    const [fsregion, setRegion] = useState([]);
    const [da, setDa] = useState([]);
    const [returnedAgent, setReturnedAgent] = useState([]);
    const [initialAgent, setInitialAgent] = useState(null)
    const [surveyMethod, setSurveyMethod] = useState([]);
    const [returnedMethods, setReturnedMethods] = useState([]);
    const [closure, setClosure] = useState(false);
    const [host, setHost] = useState([]);
    const [setting, setSetting] = useState([]);
    const [refCounty, setRefCounty] = useState([]);
    const [returnedSettings, setReturnedSettings] = useState([]);
    const [initialAffectedArea, setInitialAffectedArea] = useState();
    const [affectedArea, setAffectedArea] = useState();
    const [initialNarrative, setInitialNarrative] = useState();
    const [narrative, setNarrative] = useState('');
    const [errors, setErrors] = useState([])
    const [fsShow, setFsShow] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [successMsg, setShowSuccessMsg] = useState(false);
    const navigate = useNavigate();
    //Quill Editor Refs
    const affectedAreaQuillRef = useRef();
    const narrativeQuillRef = useRef();
    
    
    //OnChange Calls
    const handleYear = (e) => {
        setYear(e.target.value)
    }
    const handleRegion = (e) => {
        if (counties.length > 0) {
            setFsShow(true)
        }
        setFSReg(e.target.value)
    }
    const handleAgentChange = (option,newVal) => {
        setAgent(option.displayName)
        setReturnedAgent({
            childId: option.damageAgentCode,
            display: option.titleName
        })
        setInitialAgent(newVal)
    }
    const handleAgentClear = () => {
        setAgent(null)
    }
    const handleClosureChange = () => {
        setClosure(!closure)
        setErrors([])
    }
    const handleMethodChange = (event) => {
        const selectedVals = event.target.options
        var v = []
        var w = []
        for (var i = 0, l = selectedVals.length; i < l; i++) {
            if (selectedVals[i].selected) {
                const set = surveyMethod.find(x => x.surveyMethod1 === selectedVals[i].value)
                const tempItem = {
                    childId: set.surveyMethodCode,
                    display: selectedVals[i].value
                }
                v.push(selectedVals[i].value)
                w.push(tempItem)
            }
        }
        setMethods(v)
        setReturnedMethods(w)
    }
    const handleHostsChange = (selectedVals) => {
        setHosts(selectedVals)
    }
    const handleSettingsChange = (event) => {
        const selectedVals = event.target.options
        var s = []
        var r = []
        for (var i = 0, l = selectedVals.length; i < l; i++) {
            if (selectedVals[i].selected) {
                const set = setting.find(x => x.setting1 === selectedVals[i].value)
                const tempItem = {
                    childId: set.settingCode,
                    display: selectedVals[i].value
                }
                s.push(selectedVals[i].value)
                r.push(tempItem)
            }
        }
        setSettings(s)
        setReturnedSettings(r)
    }
    const handleAffectedAreaChange = (value) => {
        const stringifiedAffectedArea = JSON.stringify(value); //serialize the object
        setAffectedArea(stringifiedAffectedArea);
    }
    const handleNarrativeChange = (value) => {
        const stringifiedNarrative = JSON.stringify(value); //serialize the object
        setNarrative(stringifiedNarrative);
    }


    //Get Data from API
    const apiGetEvent = async (pestEventId) => {
        //http://fsxsnpf0193.edc.ds1.usda.gov/per24/api/api/PestEvent/GetPestEvent?pestEventId= -- URL for Deployment
        //https://localhost:7087/api/PestEvent/GetPestEvent?pestEventId= -- URL for local machine
        const baseURL = "https://localhost:7087/api/PestEvent/GetPestEvent?pestEventId=";
        try {
            const response = await fetch(`${baseURL}${pestEventId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const { damageAgentCode, displayName } = await getDamageAgent(data.damageAgent.childID);
            const damageAgentDetails = {
                childId: damageAgentCode,
                display: displayName
            }
            return { data, damageAgentDetails }; // Return the data for further processing
        } catch (error) {
            console.error("Couldn't Retrieve: ", error);
            return null;
        }
    };


    //Gets Data for Dropdowns
    useEffect(() => {
        const fetchData = async (pestEventId) => {
            const { data, damageAgentDetails } = await apiGetEvent(pestEventId);
            if (data && damageAgentDetails) {
                setEvent(data);
                setAgent(data.damageAgent.display);
                setInitialAgent(damageAgentDetails);
                setYear(data.surveyYear);
                setFSReg(data.fsregionCode);
                setClosure(data.isDeleted);
                setReturnedMethods(data.surveyMethods);
                setMethods(data.surveyMethods.map(y => y.display));
                setHosts(data.hosts);
                setReturnedSettings(data.settings);
                setSettings(data.settings.map(y => y.display));
                setCounties(data.counties);
                setInitialAffectedArea(data.affectedArea);
                setInitialNarrative(data.narrative);
            }
        };

        const fetchDropdownData = async () => {
            const [region, damage, method, host, setting, county] = await Promise.all([
                getRegions(),
                getDamageAgents(),
                getSurveyMethods(),
                getHosts(),
                getSettings(),
                getCounties(),
            ]);
            setRegion(region);
            setDa(damage.filter(y => y.status == 'Active'));
            setSurveyMethod(method);
            setHost(host);
            setSetting(setting.filter(n => n.displayOrder != 20).sort((x, y) => x.displayOrder - y.displayOrder));
            setRefCounty(county);
        }

        //Fetch all the data
        fetchData(pestEventId);
        fetchDropdownData();
    }, [pestEventId]);


    //Runs Validation for fields before submitting
    const validation = useCallback(() => {
        let errors = {};
        let valid = true;

        if (fsreg == null) {
            errors.fsregion = " Please Select a Region";
            valid = false;
        }
        if (agent == null) {
            errors.damageAgent = " Please Select a Damage Agent";
            valid = false;
        }
        if (methods.length < 1 && closure == false) {
            errors.surveyMethods = " Please Select at least one Survey Method";
            valid = false;
        }
        if (hosts.length < 1 && closure == false) {
            errors.hosts = " Please Select at least one Host";
            valid = false;
        }
        if (settings.length < 1 && closure == false) {
            errors.settings = " Please Select at least one Setting";
            valid = false;
        }
        if (counties.length < 1 && closure == false) {
            errors.counties = " Please select at least one county";
            valid = false;
        }
        if (!affectedArea || !checkQuillContent(affectedAreaQuillRef)) {
            errors.affectedArea = " Please Enter Text for Affected Area";
            valid = false;
        }
        if (!narrative || !checkQuillContent(narrativeQuillRef)) {
            errors.narrative = " Please Enter Text for Narrative";
            valid = false;
        }
        setErrors(errors);
        
        return valid;
    }, [agent, methods, hosts, settings, affectedArea, narrative, counties, fsreg, closure])

    ModuleRegistry.registerModules([ClientSideRowModelModule]);

    //Runs Put Call to Edit DB
    function SaveEvent() {
        if (validation()) {
            //http://fsxsnpf0193.edc.ds1.usda.gov/per24/api/api/PestEvent/ -- URL for Deployment
            //https://localhost:7087/api/PestEvent/ -- URL for local machine
            axios.put(`https://localhost:7087/api/PestEvent/`, {
                pestEventId: pestEventId,
                hosts: closure == true ? [] : hosts,
                settings: closure == true ? [] : returnedSettings,
                surveyMethods: closure == true ? [] : returnedMethods,
                counties: closure == true ? [] : counties,
                damageAgent: returnedAgent == '' ? event.damageAgent : returnedAgent,
                reportDate: new Date(),
                surveyYear: year,
                narrative: narrative,
                affectedArea: affectedArea,
                submitter: "kennethlee@sda.gov",
                submitterName: "Kenneth Lee",
                lastEditedBy: "kennethlee@usda.gov",
                lastEditedByName: "Kenneth Lee",
                lastEditedDate: new Date(),
                recordType: event.recordType,
                damageAgentCode: returnedAgent.childId,
                fsregionCode: fsreg,
                isDeleted: closure
            }).then(() => {
                //If successful, displays a alert letting the user know it was successful
                setSubmitted(true);
                setShowSuccessMsg(true);
            }).catch(error => {
                console.error("Error Create Pest Event", error.response.data);
            });
        }
    }

    //FS Region Popup
    const FSPopup = (props) => {
        return (
            <div>
                <Modal {...props} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Title id="centered-modal-title-vcenter">Region Changed</Modal.Title>
                    <Modal.Body>Changing the Region will cause different counties to appear on next Step.</Modal.Body>
                    <Modal.Footer>
                        <button className="usa-button" onClick={props.onHide}>Ok</button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

    //Success Popup
    const SuccessPopup = (props) => {
        return (
            <div>
                <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="centered-modal-title-vcenter">Pest Event Created Successfully</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ display: "flex", wordWrap: 'break-word' }}>
                        <button className="usa-button" onClick={() => window.location.reload()}>Create Another Pest Event</button>
                        <button className="usa-button" onClick={() => navigate('/search')}>Search Pest Events</button>
                        <button className="usa-button">Promote Pest Events</button>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
    
    //--------------------------------Map and Table------------------------------
    function MapPopup(props) {
        const mapDiv = useRef(null);

        useEffect(() => {

            if (mapDiv.current) {
                const map = new Map({
                    basemap: "topo"
                });

                // eslint-disable-next-line no-unused-vars
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

    //County/Equivalents table
    const countyTableData = refCounty.filter(x => x.fsregionCode == fsreg)
    const handleCounties = (affected) => {
        setCounties(affected)
    }


    return (
        <div className="grid-container">
            <br />
            <h2>Edit Pest Event - {year}, Region {fsreg == 9 ? 'N/A' : fsreg == 11 ? 'IITF' : fsreg}, {agent == null ? 'No Agent Selected' : agent} </h2>
            <div className="usa-button__group" style={{display: "inline-flex"}}>
                <button className="usa-button" onClick={SaveEvent}>Save</button>
                <button className="usa-button">Copy</button>
            </div>
            <br />
            <br />
            <div className="fsdp-tabs">
                <div role="tablist" aria-label="FSDP Tabs">
                    <button className="usa-button" role="tab" aria-selected={key === 1 ? "true" : "false"} aria-controls="panel-4" id="tab-4" tabIndex="0" onClick={() => setKey(1)}>
                        General
                    </button>
                    <button className="usa-button" role="tab" aria-selected={key === 2 ? "true" : "false"} aria-controls="panel-5" id="tab-5" tabIndex="-1" onClick={() => setKey(2)}>
                        Geography
                    </button>
                    <button className="usa-button" role="tab" aria-selected={key === 3 ? "true" : "false"} aria-controls="panel-6" id="tab-6" tabIndex="-1" onClick={() => setKey(3)}>
                        Narrative
                    </button>
                </div>
                <div style={key === 1 ? { display: 'flex' } : { display: 'none' }} id="panel-4" role="tabpanel" tabIndex="0" aria-labelledby="tab-4">
                    <div className="grid-container grid-col-6">
                        <div className="grid-row grid-gap">
                            <div className="mobile-lg:grid-col-6">
                                <label className="usa-label" htmlFor="year">Survey Year:</label>
                                <select className="usa-select usa-input" value={year} onChange={handleYear} id="surveyYear">
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
                                    <option value="2019">2019</option>
                                    <option value="2018">2018</option>
                                    <option value="2017">2017</option>
                                    <option value="2016">2016</option>
                                    <option value="2015">2015</option>
                                    <option value="2014">2014</option>
                                    <option value="2013">2013</option>
                                    <option value="2012">2012</option>
                                    <option value="2011">2011</option>
                                    <option value="2010">2010</option>
                                </select>
                            </div>
                            <div className="mobile-lg:grid-col-3">
                                <label className="usa-label" htmlFor="fsregion">FS Region:</label>
                                <select className="usa-select usa-input" value={fsreg} onChange={handleRegion} id="fsregionCode">
                                    {fsregion.map(x =>
                                        <option key={x.fsregionCode} value={x.fsregionCode}>{x.fsregion1}</option>
                                    )} 
                                </select>
                                <FSPopup show={fsShow} onHide={() => setFsShow(false)} />
                            </div>
                            {errors.fsregion && <div className="usa-alert usa-alert--error">{errors.fsregion}</div>}
                        </div>
                        <div>
                            <label className="usa-label" htmlFor="damageAgent">Damage Agent:</label>
                            <TypeAhead options={da} onSelect={handleAgentChange} clear={handleAgentClear} initial={initialAgent} />
                            {errors.damageAgent && <div className="usa-alert usa-alert--error">{errors.damageAgent}</div>}
                        </div>
                        <div>
                            <br />
                            <input type="checkbox" checked={closure} onChange={handleClosureChange} /> Pest Event Closure
                        </div>
                        <div>
                            <label className="usa-label" htmlFor="surveyMethod" hidden={closure == true}>Survey Method(s):</label>
                            <select className="usa-select" multiple value={methods} onChange={handleMethodChange} hidden={closure == true}>
                                {surveyMethod.map(x =>
                                    <option key={x.surveyMethodCode} value={x.surveyMethod1}>{x.surveyMethod1}</option>
                                )}
                            </select>
                            {errors.surveyMethods && <div className="usa-alert usa-alert--error">{errors.surveyMethods}</div>}
                        </div>
                        <div>
                            <label className="usa-label" htmlFor="host" hidden={closure == true}>Host(s):</label>
                            <MultiSelect options={host} onChange={handleHostsChange} initial={hosts} hidden={closure == true} />
                            {errors.hosts && <div className="usa-alert usa-alert--error">{errors.hosts}</div>}
                        </div>
                        <div>
                            <label className="usa-label" htmlFor="settings" hidden={closure == true}>Setting(s):</label>
                            <select className="usa-select" multiple value={settings} onChange={handleSettingsChange} hidden={closure == true}>
                                {setting.map(x =>
                                    <option key={x.settingCode} value={x.setting1}>{x.setting1}</option>
                                )}
                            </select>
                            {errors.settings && <div className="usa-alert usa-alert--error">{errors.settings}</div>}
                        </div>
                    </div>
                </div>
                <div style={key === 2 ? { display: 'flex' } : { display: 'none' }} id="panel-5" role="tabpanel" tabIndex="-1" aria-labelledby="tab-5">
                    <div className="grid-container grid-col-4">
                        <div className="usa-button_group" style={{ display: "flex", flexDirection: "column", border: "3px solid black", padding: "10px" }}>
                            <button className="btn btn-dark" type="button" onClick={() => setMapShow(true)} disabled={closure == true}>Counties/Equivalents Map</button>
                            <MapPopup show={mapShow} onHide={() => setMapShow(false)} />
                            <button className="btn btn-secondary" type="button" onClick={() => setTableShow(true)} disabled={closure == true}>Counties/Equivalents Table</button>
                            <CountyTable show={tableShow} onHide={() => setTableShow(false)} onSelect={handleCounties} options={countyTableData} initial={counties} />
                        </div>
                        {errors.counties && <div className="usa-alert usa-alert--error">{errors.counties}</div>}
                    </div>
                </div>
                <div style={key === 3 ? { display: 'flex' } : { display: 'none' }} id="panel-6" role="tabpanel" tabIndex="0" aria-labelledby="tab-6">
                    <div className="grid-container grid-col-6">
                        {submitted && <SuccessPopup show={successMsg} onHide={() => setShowSuccessMsg(false)} />}

                        {/*Editor for the Affected Area*/}
                        <label className="usa-label" htmlFor="affectedArea">Affected Area</label>
                        <QuillEditor
                            ref={affectedAreaQuillRef}
                            readOnly={false}
                            initialValue={initialAffectedArea}
                            onTextChange={handleAffectedAreaChange}
                            className='quill'
                            id='affectedArea'
                            rows='5'
                        />
                        {errors.affectedArea && <div className="usa-alert usa-alert--error">{errors.affectedArea}</div>}
                        {/*Editor for the Narrative*/}
                        <label className="usa-label" htmlFor="narrative">Narrative</label>
                        <QuillEditor
                            ref={narrativeQuillRef}
                            readOnly={false}
                            initialValue={initialNarrative}
                            onTextChange={handleNarrativeChange}
                            className='quill'
                            id='narrative'
                            rows='5'
                        />
                        {errors.narrative && <div className="usa-alert usa-alert--error">{errors.narrative}</div>}
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        </div>
    )
    }
