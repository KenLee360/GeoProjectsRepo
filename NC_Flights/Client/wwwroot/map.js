window.renderMap = () => {
    require(["esri/Map","esri/views/MapView","esri/layers/FeatureLayer","esri/widgets/Legend"], function (Map, MapView, FeatureLayer,Legend) {


        const map = new Map({
            basemap: "gray-vector"
        })

        const fl = new FeatureLayer({
            url:"https://services.arcgis.com/NuWFvHYDMVmmxMeM/arcgis/rest/services/NCDOT_DOAAirports/FeatureServer/0"
        })

        const view = new MapView({
            map: map,
            center: [-79.01, 35.73],
            zoom: 6,
            container: "view-div"
        });

        const legend = new Legend({
            view: view,
            layerInfos: [{
                layer: fl,
                title: "Airports in North Carolina"
            }]
        });

        
        const link = '<a href="https://localhost:7039/airports">All Airports</a>'

        const template = {
            title:  "{AirportName}",
            content: [
                {
                    type: "fields",
                    fieldInfos: [
                        {
                            fieldName: "AirportName",
                            label: "Airport Name"
                        },
                        {
                            fieldName: "AirportType",
                            label: "Airport Type"
                        },
                        {   
                            fieldName: "AirportId",
                            label: link
                        }
                    ]
                }
            ]
        };

        map.add(fl);
        fl.popupTemplate = template;
        view.ui.add(legend, "top-right");
    });
};