import React, { useRef, useEffect } from "react";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import esriConfig from "@arcgis/core/config.js";
import Home from "@arcgis/core/widgets/Home.js";
import Query from "@arcgis/core/rest/support/Query.js";
import Expand from "@arcgis/core/widgets/Expand.js";
import Legend from "@arcgis/core/widgets/Legend.js";
import './App.css'


esriConfig.portalUrl = "https://kennethpersuse.maps.arcgis.com";

function App() {

  const mapDiv = useRef(null);


  useEffect(() => {

    //Creates the Map
    if(mapDiv.current) {
      const map = new Map ({
        basemap: "gray-vector"
      });

      //Creates the Map View
      const view = new MapView ({
        map: map,
        container: mapDiv.current,
        zoom: 6,
        center: [-79.01,35.73]
      });

      //Adds the Counties Feature Layer
      const census = new FeatureLayer ({
        url: "https://services7.arcgis.com/yBaKxKckcSwc0U3o/arcgis/rest/services/Census_Counties_view/FeatureServer"
      });

      //Creates Popup Template for Feature Layer
      const template = {
        title: "Total Population",
        content: [
          {
            type:"fields",
            fieldInfos: [
              {
                fieldName: "County",
                label: "County"
              },
              {
                fieldName: "total_pop",
                label: "Population"
              }]
          }
        ]
      };

      //Create Home 
      const homeWidget = new Home ({
        view: view
      });

      //Create Legend
      const legend = new Legend ({
        view: view,
        layerInfos: [{
          layer: census,
          title: "Population Density in NC"
        }]
      });

      //Adds FeatureLayer, Template, and Home Widget
      map.add(census);
      census.popupTemplate = template;
      view.ui.add(homeWidget, "top-left");
      view.ui.add(legend, "bottom-left");

      //Creates Query and puts it in table
      const sumPop = {
        onStatisticField: "total_pop",
        outStatisticFieldName: "Population",
        statisticType: "sum"
      };
    
      const query = new Query({
        outFields: ["County", "total_pop"],
        outStatistics: [sumPop],
        groupByFieldsForStatistics: ["County"],
        geometry: census.geometry,
        returnGeometry: true
      });

      census.queryFeatures(query).then(function(results){
      
        const features = results.features;

        const table = document.createElement("table");
        table.setAttribute("class", "esri-widget");

        const headerRow = document.createElement("tr");
        table.appendChild(headerRow);

        const fields = features[0].attributes;
        for (const field in fields) {
          const headerCell = document.createElement("th");
          headerCell.textContent = field;
          headerRow.appendChild(headerCell);
        }

        features.forEach(function(feature){
          const row = document.createElement("tr");
          table.appendChild(row);

          const attributes = feature.attributes;
          for (const attribute in attributes) {
            const cell = document.createElement("td");
            cell.textContent = attributes[attribute];
            row.appendChild(cell);
          }
        })
        const queryDiv = document.getElementById("queryDiv");
        queryDiv.appendChild(table);
      });

      const expand = new Expand ({
        view: view,
        content: queryDiv,
        expandIcon: "launch",
        expanded: true
      });

      view.ui.add (expand, "bottom-right");
      view.when (() => console.log("view is ready"));
    }
  }, []);

  return (
    <div class="App">
      <div className="mapDiv" ref={mapDiv}>
        <div id="queryDiv" className="esri-widget">
          <h3>This table shows the population of each county. Clicking on the map shows the counties in more detail.</h3>
        </div>
      </div>
    </div>
  )
}

export default App
