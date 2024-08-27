import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Search from "@arcgis/core/widgets/Search.js";
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import "./EditMap.css"

const EditMap = () => {

    const editRef = useRef(null)
    const [marker, setMarker] = useState(null)
    const [mapView, setMapView] = useState(null)
    const navigate = useNavigate()

    const [airId, setAirId] = useState("")
    const [airName, setAirName] = useState("")
    const [carrier, setCarrier] = useState("")
    const [share, setShare] = useState("")
    const [long, setLong] = useState("")
    const [lat, setLat] = useState("")

    useEffect(() => {

        if (editRef.current) {
            const map = new Map({
                name: "Basemap",
                basemap: 'osm'
            });

            const view = new MapView({
                container: editRef.current,
                map: map,
            });

            const airports = new FeatureLayer({
                url: "https://services7.arcgis.com/yBaKxKckcSwc0U3o/arcgis/rest/services/Airport_Market_Share/FeatureServer",
            });

            map.add(airports)

            airports.when(() => {
                airports.queryExtent().then((res) => {
                    view.goTo(res.extent)
                })
            });

            const search = new Search({
                view: view
            })

            view.ui.add(search, {
                position: "top-left",
                index: 0
            })

            setMapView(view)

            return () => {
                if (view) {
                    view.destroy();
                }
            }
        }       
    }, [])

    useEffect(() => {

        if (mapView) {

            mapView.on('click', (e) => {

                if (marker) {
                    mapView.graphics.remove(marker)
                }
                const pointGr = new Graphic({
                    geometry: new Point({
                        longitude: e.mapPoint.longitude,
                        latitude: e.mapPoint.latitude,
                    }),
                    symbol: new SimpleMarkerSymbol({
                        color: 'blue',
                        size: '16px',
                        outline: {
                            color: 'black',
                            width: 2,
                        },
                    })
                });
                mapView.graphics.add(pointGr)
                setLong(e.mapPoint.longitude)
                setLat(e.mapPoint.latitude)
                setMarker(pointGr)
            })
        }
    },[mapView,marker])

    const handleSubmit = () => {

        const airports = new FeatureLayer({
            url: "https://services7.arcgis.com/yBaKxKckcSwc0U3o/arcgis/rest/services/Airport_Market_Share/FeatureServer",
        });

        const newfeature = {
            geometry: {
                type: 'point',
                longitude: long,
                latitude: lat
            },
            attributes: {
                AirportId: airId,
                AirportName: airName,
                MajorCarrier: carrier,
                SharePercentage: share,
                Long_DD: long,
                Lat_DD: lat
            }
        };

        const edits = {
            addFeatures: [newfeature]
        }

        airports.applyEdits(edits).then(() => {
            alert("Feature added!");
            navigate("/")
        }).catch(error => console.log("Error adding feature: ", error))
        

    };


    return (
        <div className="editRef" ref={editRef}>
            <div className="panel">
                <h2 className="title">Add Airport</h2>
                <form className="editform">
                    <div className="form-group">
                        <label htmlFor="airCode">Ariport Code</label>
                        <input type="text" className="form-control" name="airCode" value={airId} onChange={(e) => setAirId(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="airName">Airport Name</label>
                        <input type="text" className="form-control" name="airName" value={airName} onChange={(e) => setAirName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="major">Major Airline</label>
                        <select className="form-control" value={carrier} onChange={(e) => setCarrier(e.target.value)}>
                            <option>Choose...</option>
                            <option value='American Airlines'>American Airlines</option>
                            <option value='Allegiant Air'>Allegiant Air</option>
                            <option value='Delta Air Lines'>Delta Air Lines</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="share">Share Percentage</label>
                        <input type="text" className="form-control" name="share" value={share} onChange={(e) => setShare(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col">
                                <label htmlFor="latitude">Latitiude</label>
                                <input type="text" className="form-control" value={lat} onChange={(e) => setLat(e.target.value)} disabled/>
                            </div>
                            <div className="col">
                                <label htmlFor="longitude">Longitude</label>
                                <input type="text" className="form-control" value={long} onChange={(e) => setLong(e.target.value)} disabled/>
                            </div>
                        </div>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={handleSubmit}>Add Airport</button>
                </form>
            </div>
        </div>
    )
}

export default EditMap;