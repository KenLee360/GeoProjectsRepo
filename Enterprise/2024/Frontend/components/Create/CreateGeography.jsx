import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/Mapview"
import { useEffect, useRef, useState } from "react";
import './CreateGeography.css'

function CreateMap() { 

    const mapDiv = useRef(null);

    useEffect(() => {

        if (mapDiv.current) {
            const map = new Map({
                basemap: "gray-vector"
            });

            const view = new MapView({
                map: map,
                container: mapDiv.current,
                zoom: 6,
                center: [-79.01, 35.73]
            });
        }

    });

    const [open, setOpen] = useState(false);

    const openMap = () => {
        setOpen(true);
    }

    const closeMap = () => {
        setOpen(false);
    }

    return (
        <div>
            <button className="usa-button" type="button" onClick={openMap}>Open Map</button>
            {open &&
                <div className="mapDiv" ref={mapDiv} />
            }
        </div>
    )
}

export default CreateMap;