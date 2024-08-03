import React,{ useEffect, useRef, useState } from "react"
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/Mapview"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import Graphic from "@arcgis/core/Graphic"
import LayerList from "@arcgis/core/widgets/LayerList"
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery"
import Legend from "@arcgis/core/widgets/Legend"
import Expand from "@arcgis/core/widgets/Expand"
import Query from "@arcgis/core/rest/support/query"
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils"
import Modal from "react-bootstrap/Modal"
import './Map.css'

const MapPopup = ({ show, onHide, onSelect, selectedRegion, selectedYear, initial }) => {

    const mapDiv = useRef(null);
    const [selectedCounties, setSelectedCounties] = useState([])
    const clickedCounties = useRef(new Set())

    useEffect(() => {

        if (show) {
            const map = new Map({
                basemap: "topo"
            });

            const view = new MapView({
                map: map,
                container: mapDiv.current,
                zoom: 4,
                center: [-79.01, 35.73]
            });

            //Displays Counties Layer with selected Region
            const counties = new FeatureLayer({
                url: "https://dev.wrk.fs.usda.gov/dmsm/rest/services/PER/Boundaries/MapServer/1",
                definitionExpression: `FSRegion = ${selectedRegion}`,
            });

            //Creates Popup for Counties Layer
            const template = {
                title: "{NAME}, {STATE_ABBR}",
                content: [
                    {
                        type: "fields",
                        fieldInfos: [
                            {
                                fieldName: "FIPS",
                                label: "FIPS"
                            },
                            {
                                fieldName: "FSRegion",
                                label: "FS Region"
                            }
                        ]
                    }
                ]
            }

            map.add(counties);
            counties.popupTemplate = template;           
            
            //Zooms to Counties Layer on startup
            counties.when(() => {
                counties.queryExtent().then((res) => {
                    view.goTo(res.extent)
                })
            });

            //Pre-populates county color
            counties.when(() => {
                reactiveUtils.whenOnce(() => {
                    const query = counties.createQuery();
                    query.returnGeometry = true;
                    query.outFields = ['FIPS'];

                    counties.queryFeatures(query).then((res) => {
                        const graphics = res.features;
                        graphics.forEach((graphic) => {
                            const fips = graphic.attributes.FIPS;
                            const preGeo = graphic.geometry
                            const blueSymbol = {
                                type: 'simple-fill',
                                color: [0, 0, 255, 0.5] //Blue
                            }
                            const orangeSymbol = {
                                type: 'simple-fill',
                                color: [255, 165, 0, 0.5] //Orange
                            }
                            const PreCausingDamage = new Graphic({
                                geometry: preGeo,
                                symbol: blueSymbol
                            })
                            const PrePresenceOnly = new Graphic({
                                geometry: preGeo,
                                symbol: orangeSymbol
                            })
                            if (initial.some(x=> x.fips === fips && x.isCausingDamage == true)) {
                                view.graphics.add(PreCausingDamage)
                            }
                            if (initial.some(x => x.fips === fips && x.isCausingDamage == false)) {
                                view.graphics.add(PrePresenceOnly)
                            }                            
                        })                 
                    })
                })
            })


            //Fills County Boundary with Blue OnClick
            function CausingDamage(event) {
                view.hitTest(event).then(function (res) {
                    var results = res.results
                    if (results.length > 0) {
                        var graphic = results.filter(function (rest) {
                            return rest.graphic.layer === counties
                        })[0].graphic

                        const countyGeo = graphic.geometry
                        const attributes = graphic.attributes
                        const OID = graphic.attributes.OBJECTID

                        if (!clickedCounties.current.has(OID)) {
                            const fillSymbol = {
                                type: 'simple-fill',
                                color: [0, 0, 255, 0.5] //Blue
                            }

                            const fillGraphic = new Graphic({
                                geometry: countyGeo,
                                symbol: fillSymbol
                            })

                            //Queries Counties Layer and returns FIPS code
                            var query = new Query();
                            query.objectIds = [attributes.OBJECTID]
                            query.outFields = ['*']
                            counties.queryFeatures(query).then(function (res) {
                                if (res.features.length > 0) {
                                    var selected = res.features[0].attributes.FIPS
                                    const affected = {
                                        fips: selected,
                                        isCausingDamage: true,
                                        wkt: ''
                                    }
                                    setSelectedCounties(prev => [...prev, affected])
                                }
                            })

                            //Add logic to stop double selections
                            view.graphics.add(fillGraphic);
                            clickedCounties.current.add(OID)
                        }
                    }
                })          
            }

            //Creates Toggle Button for Blue Counties
            let ClickHandler;
            const dmgDiv = document.createElement('div');
            dmgDiv.className = 'esri-icon-cursor esri-widget--button esri-widget esri-interactive';
            dmgDiv.addEventListener('click', function () {
                //Stops Presence Only (Orange Counties) from running
                if (ClickHandler2) {
                    ClickHandler2.remove()
                }

                if (ClickHandler) {
                    counties.popupTemplate = template
                    ClickHandler.remove();
                    ClickHandler = null                 
                } else {
                    counties.popupTemplate = null
                    ClickHandler = view.on('click', CausingDamage)
                } 
            })

            //Fills County with Orange OnClick
            function PresenceOnly(event) {
                view.hitTest(event).then(function (res) {
                    var results = res.results
                    if (results.length > 0) {
                        var graphic = results.filter(function (rest) {
                            return rest.graphic.layer === counties
                        })[0].graphic                        

                        const countyGeo = graphic.geometry
                        const attributes = graphic.attributes
                        const OID = graphic.attributes.OBJECTID

                        //If Statement stops map double slections
                        if (!clickedCounties.current.has(OID)) {
                            const fillSymbol = {
                                type: 'simple-fill',
                                color: [255, 165, 0, 0.5] //Orange
                            }

                            const fillGraphic = new Graphic({
                                geometry: countyGeo,
                                symbol: fillSymbol
                            })

                            //Queries Counties Layer and returns FIPS code
                            var query = new Query();
                            query.objectIds = [attributes.OBJECTID]
                            query.outFields = ['*']
                            counties.queryFeatures(query).then(function (res) {
                                if (res.features.length > 0) {
                                    var selected = res.features[0].attributes.FIPS
                                    const affected = {
                                        fips: selected,
                                        isCausingDamage: false,
                                        wkt: ''
                                    }
                                    setSelectedCounties(prev => [...prev, affected])
                                }
                            })

                            view.graphics.add(fillGraphic);
                            clickedCounties.current.add(OID)
                        }
                    }
                })
            }

            //Create Toggle Button for Orange Counties
            let ClickHandler2;
            const presDiv = document.createElement('div')
            presDiv.className = 'esri-icon-cursor-filled esri-widget--button esri-widget esri-interactive';
            presDiv.addEventListener('click', function () {
                //Stops Causing Damage (Blue Counties) from running
                if (ClickHandler) {
                    ClickHandler.remove()
                }

                if (ClickHandler2) {
                    counties.popupTemplate = template
                    ClickHandler2.remove();
                    ClickHandler2 = null
                } else {
                    counties.popupTemplate = null
                    ClickHandler2 = view.on('click', PresenceOnly)
                }                                               
            })
            

            view.ui.add(dmgDiv, "top-right")
            view.ui.add(presDiv, "top-right")

            //Adds Reference Layers
            const ids_points = new FeatureLayer({
                url: "https://dev.wrk.fs.usda.gov/dmsm/rest/services/PER/IDS/MapServer/0",
                definitionExpression: `FSRegion = ${selectedRegion} AND SURVEY_YEAR = ${selectedYear}`
            })
            const ids_polygons = new FeatureLayer({
                url: "https://dev.wrk.fs.usda.gov/dmsm/rest/services/PER/IDS/MapServer/1",
                definitionExpression: `RPT_RGN = ${selectedRegion} AND SURVEY_YR = ${selectedYear}`
            })
            const ids_counties_out = new FeatureLayer({
                url: "https://dev.wrk.fs.usda.gov/dmsm/rest/services/PER/IDS/MapServer/2",
                definitionExpression: `FSRegion = ${selectedRegion} AND SURVEY_YR = ${selectedYear}`,
                visible: false
            })
            const pest_history = new FeatureLayer({
                url: "https://dev.wrk.fs.usda.gov/dmsm/rest/services/PER/PestHistory/MapServer/0",
                visible: false
            })

            map.add(ids_points)
            map.add(ids_polygons)
            map.add(ids_counties_out)
            map.add(pest_history)

            //Creates LayerList
            const llist = new LayerList({
                view: view
            })
            const llexpand = new Expand({
                view: view,
                content: llist,
                expandTooltip: "Turn On/Off Layers",
                coolapseTooltip: "Close Layer List"
            })

            view.ui.add(llexpand, "top-left")

            //Creates Basemap Gallery
            const gallery = new BasemapGallery({
                view: view
            })

            const galleryExpand = new Expand({
                view: view,
                content: gallery,
                expandTooltip: "Select Base Map",
                collapseTooltip: "Close Base Map"
            })

            view.ui.add(galleryExpand, "top-left")

            //Creates Legend
            const legend = new Legend({
                view: view
            })

            const legendExpand = new Expand({
                view: view,
                content: legend,
                expandTooltip: "Display Legend",
                collapseTooltip: "Close Legend"
            })

            view.ui.add(legendExpand, "bottom-left")

            return () => {
                if (view) {
                    view.container = null;
                }
            }
        }
        
    }, [show]);


    const onHideMap = () => {
        console.log(selectedCounties)
        onSelect(selectedCounties)
        onHide()
    }
    

    return (
        <div>
            <Modal show={show} onHide={onHideMap} onEntered={() => mapDiv.current} size="xl" fullscreen="true" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Title id="centered-modal-title-vcenter">Choose Counties</Modal.Title>
                <Modal.Body>
                    <div className="mapDiv" ref={mapDiv}>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="usa-button" onClick={onHideMap}>Close Map</button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default MapPopup