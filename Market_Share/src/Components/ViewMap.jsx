import { useEffect, useState, useRef } from "react";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Expand from "@arcgis/core/widgets/Expand.js";
import aaLogo from "/src/assets/aa_logo.png"
import allegiantLogo from "/src/assets/allegiant.jfif"
import deltaLogo from "/src/assets/delta.jfif"
import "./ViewMap.css"


const ViewMap = () => {

    const viewDiv = useRef(null);
    const [carrier, setCarrier] = useState('')
    const [airName, setAirName] = useState('')
    const [share, setShare] = useState('')

    useEffect(() => {
        if (viewDiv.current) {
            const map = new Map({
                basemap: "osm"
            });

            //Creates MapView
            const view = new MapView({
                map: map,
                container: viewDiv.current,
                //center: [-80.13, 35.65],
                //zoom: 6
                
            });

            const airports = new FeatureLayer({
                url: "https://services7.arcgis.com/yBaKxKckcSwc0U3o/arcgis/rest/services/Airport_Market_Share/FeatureServer",
                outFields: ['AirportName', 'MajorCarrier', 'SharePercentage'],
            });            

            map.add(airports)

            airports.when(() => {
                airports.queryExtent().then((res) => {
                    view.goTo(res.extent)
                })
            });

            view.on('click', (event) => {
                view.hitTest(event).then((response) => {
                    const result = response.results[0];
                    if (result.graphic) {
                        const attributes = result.graphic.attributes;
                        setAirName(`${attributes.AirportName}`);
                        setCarrier(`${attributes.MajorCarrier}`);
                        setShare(`${attributes.SharePercentage}`);
                    } else {
                        setAirName('No airport selected.');
                    }
                });
            });

            const topExpand = new Expand({
                view: view,
                content: document.getElementById('divide'),
                expandIconClass: "esri-icon-info",
                group: "top-left",
                expanded: true
            })

            view.ui.add(topExpand, "top-right");

            return () => {
                if (view) {
                    view.destroy()
                }
            }
        }

    }, [])

    const getImg = (carrier) => {
        if (airName != '') {
            if (carrier == 'American Airlines') return aaLogo
            if (carrier == 'Allegiant Air') return allegiantLogo
            if (carrier == 'Delta Air Lines') return deltaLogo
        } else {
            return null
        }      
    }

    return (
        <div>
            <div className="viewDiv" ref={viewDiv}></div>
            <div id="divide" style={{ padding: '10px' }}>
                <h3>{airName || 'No Airport Selected'}</h3>
                <img src={getImg(carrier)} width='300' height='200' hidden={airName == ''} alt="AirlineImage"/>
                <br />
                <h4 hidden={airName == '' || airName == null}>{carrier || '[SELECT AIRPORT]'} flys {share || 0}% <br /> of the total passengers at <br /> {airName || '[SELECT AIRPORT]'}.</h4>
            </div>
        </div>
    )
}

export default ViewMap;