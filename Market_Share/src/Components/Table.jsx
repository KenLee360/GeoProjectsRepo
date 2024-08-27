import { useEffect, useState } from "react";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Query from '@arcgis/core/rest/support/Query';

const FeatureTable = () => {
    const [edit,setEdit] = useState(null)
    const [features, setFeatures] = useState([]);

    const [code,setCode] = useState('')
    const [name, setName] = useState('')
    const [share, setShare] = useState('')
    const [carrier, setCarrier] = useState('')

    useEffect(() => {
        const featureLayer = new FeatureLayer({
            url: "https://services7.arcgis.com/yBaKxKckcSwc0U3o/arcgis/rest/services/Airport_Market_Share/FeatureServer",
        });

        const query = new Query({
            where: '1=1', // Return all features
            outFields: ['*'], // Return all fields
            returnGeometry: false, // No need for geometry in a table
        });

        featureLayer.queryFeatures(query).then((result) => {
            setFeatures(result.features.map((f) => f.attributes));
        });
    }, []);

    const handleEdit = (feature) => {
        setEdit(feature)
        setCode(feature.AirportId)
        setName(feature.AirportName)
        setCarrier(feature.MajorCarrier)
        setShare(feature.SharePercentage)
    }
    const handleCode = (value) => {
        setCode(value)
    }
    const handleName = (value) => {
        setName(value)
    }
    const handleCarrier = (value) => {
        setCarrier(value)
    }
    const handleShare = (value) => {
        setShare(value)
    }
    const handleSave = async () => {

        const featureLayer = new FeatureLayer({
            url: "https://services7.arcgis.com/yBaKxKckcSwc0U3o/arcgis/rest/services/Airport_Market_Share/FeatureServer",
        });

        const query = new Query({
            where: `OBJECTID = ${edit.OBJECTID}`,
            outFields: ['*'],
            returnGeometry: false,
        });


        const result = await featureLayer.queryFeatures(query);
        if (result.features.length === 1) {
            const feature = result.features[0];
            feature.attributes.AirportId = code;
            feature.attributes.AirportName = name;
            feature.attributes.MajorCarrier = carrier;
            feature.attributes.SharePercentage = share;

            const edits = {
                updateFeatures: [feature],
            };

            featureLayer.applyEdits(edits).then(() => {
                alert('Feature updated successfully!');
                window.location.reload()
                setEdit(null)
            }).caatch(err => console.log("Error Saving feature: ", err))
        }     
    };

    const handleDelete = async(feature) => {
        const featureLayer = new FeatureLayer({
            url: "https://services7.arcgis.com/yBaKxKckcSwc0U3o/arcgis/rest/services/Airport_Market_Share/FeatureServer",
        });

        const query = new Query({
            where: `OBJECTID = ${feature.OBJECTID}`,
            outFields: ['*'],
            returnGeometry: false,
        });

        const result = await featureLayer.queryFeatures(query);
        if (result.features.length === 1) {
            const feature = result.features[0];

            const edits = {
                deleteFeatures: [feature],
            };

            featureLayer.applyEdits(edits).then(() => {
                alert('Feature deleted successfully!');
                window.location.reload()
            });
        }
    };
    
    return (
        <div className="container mt-4">
            <h3 className="text-center">Edit Features</h3>
            <table className="table table-striped mt-3">
                <thead className="thead-dark">
                    <tr>
                        <th>Airport Code</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>Airport Name</th>
                        <th>Carrier</th>
                        <th>Share %</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {features.map((feature) => (
                        <tr key={feature.OBJECTID}>
                            <td>
                                {edit == feature ? (
                                    <input type="text" className="form-control" value={code} onChange={(e) => handleCode(e.target.value)} />
                                ) : (
                                    feature.AirportId
                                )}   
                            </td>
                            <td>{feature.Lat_DD}</td>
                            <td>{feature.Long_DD}</td>
                            <td>
                                {edit == feature ? (
                                    <input type="text" className="form-control" value={name} onChange={(e) => handleName(e.target.value)} />
                                ) : (
                                    feature.AirportName
                                )}                         
                            </td>
                            <td>
                                {edit == feature ? (
                                    <select className="form-control" value={carrier} onChange={(e) => handleCarrier(e.target.value)}>
                                        <option value='American Airlines'>American Airlines</option>
                                        <option value='Allegiant Air'>Allegiant Air</option>
                                        <option value='Delta Air Lines'>Delta Air Lines</option>
                                    </select>
                                ) : (
                                    feature.MajorCarrier
                                )} 
                            </td>
                            <td>
                                {edit == feature ? (
                                    <input type="text" className="form-control" value={share} onChange={(e) => handleShare(e.target.value)} />
                                ) : (
                                    feature.SharePercentage
                                )}  
                            </td>
                            <td>
                                {edit == feature ? (
                                    <button type="button" className="btn btn-success" onClick={() => handleSave()}>Save</button>
                                ) : (
                                    <>
                                        <button type="button" className="btn btn-info" onClick={() => handleEdit(feature)}>Edit</button>
                                        <button type="button" className="btn btn-danger" onClick={() => handleDelete(feature)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FeatureTable