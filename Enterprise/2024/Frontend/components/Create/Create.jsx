/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getRegions, getDamageAgents, getSurveyMethods, getHosts, getSettings, getCounties } from "../../services/References";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import MultiSelect from "../Create/components/MultiSelect";
import TypeAhead from "./components/TypeAhead";
import CountyTable from "../Create/components/CountyTable";
import MapPopup from "../Create/components/Map";
import "./CreateGeography.css";
import QuillEditor from "../Common/QuillEditor";
import { checkQuillContent } from "../../utils/quillUtils";

function Create() {

    const [step, setStep] = useState(0)
    const Titles = ['General', 'Geography', 'Narrative']
    const [errors, setErrors] = useState({})
    const [mapShow, setMapShow] = useState(false);
    const [tableShow, setTableShow] = useState(false);
    const [fsShow, setFsShow] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [successMsg, setShowSuccessMsg] = useState(false);
    const [preset, setPreset] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    const navigate = useNavigate()


    const [fsregion, setRegion] = useState([])
    const [da, setDa] = useState([])
    const [surveyMethod, setSurveyMethod] = useState([])
    const [hosts, setHosts] = useState([])
    const [settings, setSetting] = useState([])
    const [counties, setCounties] = useState([])

    //Quill Editor Refs
    const affectedAreaQuillRef = useRef();
    const narrativeQuillRef = useRef();

    //--Survey Year--
    const [selectedYear, setSelectedYear] = useState('2024')
    const handleYearChange = (event) => {
        setSelectedYear(event.target.value)
        setPreset(true)
    }
    //--FS Region--
    const [selectedRegion, setSelectedRegion] = useState('1')
    const handleRegionChange = (event) => {
        if (affectedCounties.length > 0) {
            setFsShow(true)
        }
        setSelectedRegion(event.target.value)
        setPreset(true)
    }
    //--Damage Agent
    const [selectedAgent, setSelectedAgent] = useState(null)
    const [returnedAgent, setReturnedAgent] = useState([]);
    const [initialAgent, setInitialAgent] = useState(null)
    const handleAgentChange = (option, newVal) => {
        setSelectedAgent(option.displayName)
        setReturnedAgent({
            childId: option.damageAgentCode,
            display: option.titleName
        })
        setInitialAgent(newVal)
    }
    const handleAgentClear = () => {
        setSelectedAgent(null)
    }
    //--Survey Methods--
    const [selectedMethods, setSelectedMethods] = useState([]);
    const [returnedMethods, setReturnedMethods] = useState([]);
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
        setSelectedMethods(v)
        setReturnedMethods(w)
    }
    //--Hosts
    const [selectedHosts, setSelectedHosts] = useState([])
    const handleHostsChange = (selectedVals) => {
        setSelectedHosts(selectedVals)
    }
    //--Settings
    const [selectedSettings, setSelectedSettings] = useState([])
    const [returnedSettings, setReturnedSettings] = useState([])
    const handleSettingsChange = (event) => {
        const selectedVals = event.target.options
        var s = []
        var r = []
        for (var i = 0, l = selectedVals.length; i < l; i++) {
            if (selectedVals[i].selected) {
                const set = settings.find(x => x.setting1 === selectedVals[i].value)
                const tempItem = {
                    childId: set.settingCode,
                    display: selectedVals[i].value
                }
                s.push(selectedVals[i].value)
                r.push(tempItem)
            }
        }
        setSelectedSettings(s)
        setReturnedSettings(r)
    }

    //AffectedArea
    const [affectedArea, setAffectedArea] = useState('');
    //State to hold the content of the Affected Area if the user goes back to the previous step
    const [affectedAreaContent, setAffectedAreaContent] = useState('');
    const handleAffectedAreaChange = (value) => {
        const stringifiedAffectedArea = JSON.stringify(value); //serialize the object
        setAffectedArea(stringifiedAffectedArea)
    }
    //Narrative
    const [narrative, setNarrative] = useState('');
    //State to hold the content of the Narrative if the user goes back to the previous step
    const [narrativeContent, setNarrativeContent] = useState('');
    const handleNarrativeChange = (value) => {
        const stringifiedNarrative = JSON.stringify(value); //serialize the object
        setNarrative(stringifiedNarrative)
    }
    //Counties
    const [affectedCounties, setAffectedCounties] = useState([])
    //Closure
    const [closure, setClosure] = useState(false)
    const handleClosureChange = () => {
        setClosure(!closure)
    }
    //Grid-Col Resizing
    const handleResize = () => {
        setScreenWidth(window.innerWidth)
    }
    //--Brings in Data from DB
    useEffect(() => {

        const fetchRegions = async () => {
            const region = await getRegions();
            setRegion(region);
        };

        const fetchAgents = async () => {
            const agent = await getDamageAgents();
            setDa(agent.filter(y => y.status == 'Active'));
        };

        const fetchMethods = async () => {
            const method = await getSurveyMethods();
            setSurveyMethod(method);
        };
        const fetchHosts = async () => {
            const host = await getHosts();
            setHosts(host);
        };

        const fetchSettings = async () => {
            const setting = await getSettings();
            setSetting(setting.filter(n => n.displayOrder != 20).sort((x, y) => x.displayOrder - y.displayOrder));
        }

        const fetchCounties = async () => {
            const county = await getCounties();
            setCounties(county);
        }

        fetchRegions();
        fetchAgents();
        fetchMethods();
        fetchHosts();
        fetchSettings();
        fetchCounties();
    }, []);

    // ENH: Consider better handling of state to precisely identify what has changed
    useEffect(() => {
        // Function to check if there are any unsaved changes
        const hasUnsavedChanges = () => {
            const hasAffectedAreaContent = affectedAreaQuillRef.current && checkQuillContent(affectedAreaQuillRef);
            const hasNarrativeContent = narrativeQuillRef.current && checkQuillContent(narrativeQuillRef);
            return (
                selectedAgent || selectedMethods.length > 0 || selectedHosts.length > 0 || selectedSettings.length > 0 || closure ||
                affectedCounties.length > 0 || hasAffectedAreaContent || hasNarrativeContent || preset
            )
        }
        if (hasUnsavedChanges()) {
            const handleBeforeUnload = (event) => {
                const message = "Are you Sure?";
                event.returnValue = message;
                return message;
            };

            window.addEventListener('beforeunload', handleBeforeUnload);

            return () => {
                // Cleanup function to remove the event listener
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
        }
    }, [selectedYear, selectedRegion, selectedAgent, selectedMethods, selectedHosts, selectedSettings, closure, affectedArea, narrative, affectedCounties, preset]);

    //Changes grid-col size based on screen width -- 508 compliance
    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.addEventListener('resize', handleResize)
        };
    },[])

    //Changes grid-col size based on screen width -- 508 compliance
    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.addEventListener('resize', handleResize)
        };
    },[])

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

    //Tooltip Message
    const tooltip = (
        <Popover style={{ color: "#1b1b1b", backgroundColor: "#fcfcfc", boxShadow: "2px 2px 38px - 2px #858585" }}>
            <Popover.Body>
                SHIFT + Click -- Select Inline <br />
                CTRL + Click -- Select Any Record
            </Popover.Body>
        </Popover>
    )

    //Changes Step value to Render Pages
    function NextStep() {
        if (validation()) {
            setStep((curr) => curr + 1)
        }
    }

    function BackStep() {
        if (step == 2) { 
            // Save temp content for Affected Area and Narrative
            setAffectedAreaContent(affectedArea);
            setNarrativeContent(narrative);
        }
        setStep((curr) => curr - 1)
    }
    //Creates Vaidations for each step
    const validation = useCallback(() => {
        let errors = {};
        let valid = true;

        switch (step) {
            case 0:
                if (selectedAgent == null) {
                    errors.damageAgent = " Please Select a Damage Agent";
                    valid = false;
                }
                if (selectedMethods.length < 1 && closure == false) {
                    errors.surveyMethods = " Please Select at least one Survey Method";
                    valid = false;
                }
                if (selectedHosts.length < 1 && closure == false) {
                    errors.hosts = " Please Select at least one Host";
                    valid = false;
                }
                if (selectedSettings.length < 1 && closure == false) {
                    errors.settings = " Please Select at least one Setting";
                    valid = false;
                }
                break;
            case 1:
                if (affectedCounties.length < 1 && closure == false) {
                    errors.counties = " Please select at least one county";
                    valid = false;
                }
                break;
            case 2:
                if (!affectedArea || !checkQuillContent(affectedAreaQuillRef)) {
                    errors.affectedArea = " Please Enter Text for Affected Area";
                    valid = false;
                }
                if (!narrative || !checkQuillContent(narrativeQuillRef)) {
                    errors.narrative = " Please Enter Text for Narrative";
                    valid = false;
                }
                break;
        }
        setErrors(errors);
        return valid;
    }, [selectedAgent, selectedMethods, selectedHosts, selectedSettings, closure, affectedArea, narrative, step, affectedCounties])


    //Runs the Post Request After Validation
    function PostEvent() {
        if (validation()) {
            //Will need to change some fields as ICAM is implemented
            //http://fsxsnpf0193.edc.ds1.usda.gov/per24/api/api/PestEvent -- URL for Deployment
            //https://localhost:7087/api/PestEvent -- URL for local machine
            axios.post(`https://localhost:7087/api/PestEvent`, {
                hosts: closure == true ? [] : selectedHosts,
                settings: closure == true ? [] : returnedSettings,
                surveyMethods: closure == true ? [] : returnedMethods,
                counties: closure == true ? [] : affectedCounties,
                damageAgent: returnedAgent,
                reportDate: new Date(),
                surveyYear: selectedYear,
                narrative: narrative,
                affectedArea: affectedArea,
                submitter: "kennethlee@sda.gov",
                submitterName: "Kenneth Lee",
                lastEditedBy: "kennethlee@usda.gov",
                lastEditedByName: "Kenneth Lee",
                lastEditedDate: new Date(),
                recordType: "Source",
                damageAgentCode: returnedAgent.childId,
                fsregionCode: selectedRegion,
                isDeleted: closure
            }).then(() => {
                //If successful, displays a alert letting the user know it was successful and gives optionson what to do next
                setSubmitted(true);
                setShowSuccessMsg(true);
            }).catch(error => {
                console.log("Error Create Pest Event", error.res.data);
            });
        }

    }



    //----------------------------------Step 2(Map)-------------------------------------

    //CountyMap
    const handleMapped = (selectedCounties) => {
        setAffectedCounties(selectedCounties)
    }

    //County/Equivalents table
    const countyTableData = counties.filter(x => x.fsregionCode == selectedRegion.toString())
    const handleCounties = (affected) => {
        setAffectedCounties(affected)
    }


    //----------------------------------Return-------------------------------------

    switch (step) {
        case 0:
            return (
                <>
                <div className="grid-container">
                    <br />
                    <h2>Create Pest Event - {selectedYear}, Region {selectedRegion == 9 ? 'N/A' : selectedRegion == 11 ? 'IITF' : selectedRegion}, {selectedAgent == null ? 'No Agent Selected' : selectedAgent}</h2>
                </div>
                    <div className={screenWidth > 1050 ? "grid-container grid-col-4" : "grid-container grid-col-6"}>                  
                    <br />
                    <div className="grid-row grid-gap">
                        <div className="mobile-lg:grid-col-6">
                            <label className="usa-label" htmlFor="year">Survey Year:</label>
                                <select className="usa-select usa-input" value={selectedYear} onChange={handleYearChange} required id="year" name="year">
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                </select>
                            </div>
                            <div className="mobile-lg:grid-col-6">
                                <label className="usa-label" htmlFor="fsregion">FS Region:</label>
                                <select className="usa-select usa-input" value={selectedRegion} onChange={handleRegionChange} required id="fsregion" name="fsregion">
                                    {fsregion.map(x =>
                                        <option key={x.fsregionCode} value={x.fsregionCode}>{x.fsregion1}</option>
                                    )}
                                </select>
                                <FSPopup show={fsShow} onHide={() => setFsShow(false)} />
                            </div>
                        </div>
                        <div>
                            <label className="usa-label" htmlFor="damageAgent">Damage Agent:</label>
                            <TypeAhead options={da} onSelect={handleAgentChange} clear={handleAgentClear} initial={initialAgent} />
                            {errors.damageAgent && <div className="usa-alert usa-alert--error">{errors.damageAgent}</div>}
                        </div>
                        <br />
                        <div className="checkbox_container">
                            <input type="checkbox" className="large_checkbox" checked={closure} onChange={handleClosureChange} id="closure" />
                            <label className="checkbox_label" htmlFor="closure">Pest Event Closure</label>
                        </div>
                        <div>
                            <OverlayTrigger trigger="click" placement="bottom" overlay={tooltip}>
                                <label className="usa-label usa-link" htmlFor="surveyMethod" hidden={closure == true}>Survey Method(s):</label>
                            </OverlayTrigger>
                            <select id="surveyMethod" className="selector" multiple value={selectedMethods} onChange={handleMethodChange} hidden={closure == true}>
                                {surveyMethod.map(x =>
                                    <option key={x.surveyMethodCode} value={x.surveyMethod1}>{x.surveyMethod1}</option>
                                )}
                            </select>
                            {errors.surveyMethods && <div className="usa-alert usa-alert--error">{errors.surveyMethods}</div>}
                        </div>
                        <div>
                            <label className="usa-label" htmlFor="hosts" hidden={closure == true}>Host(s):</label>
                            <MultiSelect options={hosts} onChange={handleHostsChange} initial={selectedHosts} hidden={closure == true} />
                            {errors.hosts && <div className="usa-alert usa-alert--error">{errors.hosts}</div>}
                        </div>
                        <div>
                            <OverlayTrigger trigger="click" placement="bottom" overlay={tooltip}>
                                <label className="usa-label usa-link" htmlFor="settings" hidden={closure == true}>Setting(s):</label>
                            </OverlayTrigger>
                            <select id="settings" className="selector" multiple value={selectedSettings} onChange={handleSettingsChange} hidden={closure == true}>
                                {settings.map(x =>
                                    <option key={x.settingCode} value={x.setting1}>{x.setting1}</option>
                                )}
                            </select>
                            {errors.settings && <div className="usa-alert usa-alert--error">{errors.settings}</div>}
                        </div>
                        <br />
                        <br />
                        <button className="usa-button" type="button" onClick={BackStep} disabled={step == 0}>Back</button>
                        <button className="usa-button" type="button" onClick={NextStep} disabled={step == Titles.length - 1}>
                            {step === Titles.length - 1 ? "Submit" : "Next"}</button>
                    </div>
                </>
            )
        case 1:
            return (
                <>
                    <div className="grid-container">
                        <br />
                        <h2>Create Pest Event - {selectedYear}, Region {selectedRegion == 9 ? 'N/A' : selectedRegion == 11 ? 'IITF' : selectedRegion}, {selectedAgent == null ? 'No Damage Agent Selected' : selectedAgent}</h2>
                </div>
                    <div className={screenWidth > 1050 ? "grid-container grid-col-4" : "grid-container grid-col-6"}>
                    <br />
                    <div className="usa-button_group" style={{ display: "flex", flexDirection: "column", border: "3px solid black", padding: "10px" }}>
                        <button className="usa-button usa-button--accent-warm" type="button" onClick={() => setMapShow(true)} disabled={closure == true}>Counties/Equivalents Map</button>
                            <MapPopup show={mapShow} onHide={() => setMapShow(false)} onSelect={handleMapped} selectedRegion={selectedRegion} selectedYear={selectedYear} initial={affectedCounties} />                       
                        <button className="usa-button usa-button--accent-warm" type="button" onClick={() => setTableShow(true)} disabled={closure == true}>Counties/Equivalents Table</button>
                        <CountyTable show={tableShow} onHide={() => setTableShow(false)} onSelect={handleCounties} options={countyTableData} initial={affectedCounties} />
                    </div>
                    {errors.counties && <div className="usa-alert usa-alert--error">{errors.counties}</div>}
                    <br />
                    <br />
                    <button className="usa-button" type="button" onClick={BackStep} disabled={step == 0}>Back</button>
                    <button className="usa-button" type="button" onClick={NextStep} disabled={step == Titles.length - 1}>
                        {step === Titles.length - 1 ? "Submit" : "Next"}</button>
                </div>
                </>
            )
        case 2:
            return (
                <>
                    <div className="grid-container">
                        <br />
                        <h2>Create Pest Event - {selectedYear}, Region {selectedRegion == 9 ? 'N/A' : selectedRegion == 11 ? 'IITF' : selectedRegion}, {selectedAgent == null ? 'No Damage Agent Selected' : selectedAgent}</h2>
                    </div>
                    <div className={screenWidth > 1050 ? "grid-container grid-col-4" : "grid-container grid-col-6"}>
                        <br />
                        {submitted && <SuccessPopup show={successMsg} onHide={() => setShowSuccessMsg(false)} />}
                        {/*Editor for the Affected Area*/}
                        <label className="usa-label" htmlFor="affectedArea">Affected Area</label>
                        <QuillEditor
                            ref={affectedAreaQuillRef}
                            readOnly={false}
                            initialValue={affectedAreaContent}
                            onTextChange={handleAffectedAreaChange}
                            className='quill'
                            id='affectedArea'
                            rows='3'
                        />
                        {errors.affectedArea && <div className="usa-alert usa-alert--error">{errors.affectedArea}</div>}

                        {/*Editor for the Narrative*/}
                        <label className="usa-label" htmlFor="narrative">Narrative</label>
                        <QuillEditor
                            ref={narrativeQuillRef}
                            readOnly={false}
                            initialValue={narrativeContent}
                            onTextChange={handleNarrativeChange}
                            className='quill'
                            id='narrative'
                            rows='3'
                        />
                        {errors.narrative && <div className="usa-alert usa-alert--error">{errors.narrative}</div>}
                        <br />
                        <br />
                        <button className="usa-button" type="button" onClick={BackStep} disabled={step == 0}>Back</button>
                        <button
                            className="usa-button"
                            type="submit"
                            onClick={PostEvent}
                            disabled={submitted}
                        >
                            {step === Titles.length - 1 ? "Save" : "Next"}
                        </button>
                    </div>
                </>
            )
    }

}

export default Create;