import { useEffect, useState } from "react";
import { getRegions, getDamageAgents  } from "../../services/References";
import Select from "react-select"

const NewSearch = () => {


    const [pests,setPests] = useState([])
    const [selected, setSelected] = useState([])
    const [selectedRegion, setSelectedRegion] = useState(null)
    const [fsregion, setRegion] = useState([])
    const [da,setDa] = useState([])

    const types = [
        { value: 'Regional', label: 'Regional' },
        { value: 'Source', label: 'Source' },
        { value: 'National', label: 'National' }
    ]

    useEffect(() => {
        fetch("https://localhost:7087/api/PestEvent/GetPestEvents")
            .then((response) => response.json())
            .then((data) => {
                setPests(data.sort((x, y) => y.surveyYear - x.surveyYear))
            })
            .catch(error => {
                console.error("Couldn't Retrieve: ", error)
            });

        const fetchRegions = async () => {
            const region = await getRegions();
            setRegion(region);
        };

        const fetchAgents = async () => {
            const agent = await getDamageAgents();
            setDa(agent.filter(y => y.status == 'Active'));
        };

        fetchRegions();
        fetchAgents();

    }, []);

    const handleType = (selected) => {
        setSelected(selected)

        const selectedTypes = selected.map(y => y.value)
        setPests(pests.filter(x => selectedTypes.includes(x.recordType)))
    }
    const handleFs = (e) => {
        setSelectedRegion(e.target.value)
        console.log(selectedRegion)
    }

    const getData = () => {
        const selectedTypes = selected.map(y => y.value)
        let filtered = pests
        if (selectedTypes) filtered = pests.filter(x => selectedTypes.includes(x.recordType))
        //if (selectedRegion) filtered = pests.filter(x => x.fsregionCode.toString() == selectedRegion)
        //if (selectedTypes && selectedRegion)  filtered = pests.filter(x => selectedTypes.includes(x.recordType) && x.fsregionCode.toString() == selectedRegion)
        setPests(filtered)
        console.log(filtered)
        
    };


    return (
        <div className="grid-container">
            <div className="usa-card_container">
                <header className="usa-card__header">
                    <h2 className="usa-card__heading">Table Filters</h2>
                </header>
                <div className="usa-card__body">
                    <div className="grid-row">
                        <div className="grid-col-6">
                            <label>Type</label>
                            <Select isMulti value={selected} options={types} onChange={handleType} placeholder="Select Record Type.." />
                            <label>Region</label>
                            <select className="usa-select" value={selectedRegion} onChange={(e) => handleFs(e)}>
                                <option value="">All</option>
                                {fsregion.map(x =>
                                    <option key={x.fsregionCode} value={x.fsregionCode}>{x.fsregion1}</option>
                                )}
                            </select>
                        </div>
                        <div className="grid-col-6">
                            <label>Damage Agent</label>
                            <input type="text" className="usa-input" />
                        </div>
                    </div>                    
                </div>
                <div className="usa-card__footer">
                    <button className="usa-button" onClick={getData}>Filter</button>
                </div>
            </div>
            <div>
                <table className="usa-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Damage Agent</th>
                            <th>Survey Year</th>
                            <th>FS Region</th>
                            <th>Submitter</th>
                        </tr>
                        <tr>
                            <th>
                                <Select isMulti value={selected} options={types} onChange={handleType} placeholder="Select Record Type.." />
                                <button onClick={getData}>Filter</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {pests.map((x, index) =>
                            <tr key={index}>
                                <td>{x.recordType}</td>
                                <td>{x.damageAgent.display}</td>
                                <td>{x.surveyYear}</td>
                                <td>{x.fsregionCode}</td>
                                <td>{x.submitterName}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default NewSearch