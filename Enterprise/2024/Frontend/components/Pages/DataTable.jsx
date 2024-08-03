import { useEffect, useState } from "react";
import Select from 'react-select';

const TestTable = () => {

    const [events, setEvents] = useState([])
    const [filter, setFilter] = useState({})
    const [types, setTypes] = useState([])
    const [query, setQuery] = useState('')
    const [DD, setDD] = useState(false)
    const [typeDD, setTypeDD] = useState(false)
    const [currPage, setCurrPage] = useState(1)
    const rowsPerPage = 25
    const start = (currPage - 1) * rowsPerPage
    const end = currPage * rowsPerPage

    useEffect(() => {
        fetch("https://localhost:7087/api/PestEvent/GetPestEvents")
            .then((response) => response.json())
            .then((data) => {
                setEvents(data)
            })
            .catch(error => {
                console.error("Couldn't Retrieve: ", error)
            });
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target) {
                setDD(false)
            }
           
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousdown', handleClickOutside)
        }
    }, [])

    //Normal Dropdowns
    function getVals(events, column) {
        return [...new Set(events.map(item => item[column]))]
    }

  
    const handleFilter = (column, value) => {
        console.log(value)
        setFilter(prev => ({ ...prev, [column]: value }))
        setCurrPage(1)
    }

    const filtered = events.filter(row =>
        query.length < 1 ? Object.keys(filter).every(column => filter[column] === '' || row[column].toString() === filter[column].toString())
            : Object.keys(filter).every(column => filter[column] === '' || row[column].display === filter[column].display) 
    
    )
               
    //Pagination
    const slick = filtered.slice(start,end)

    const PrevPage = () => {
        if (currPage === 1) return;
        setCurrPage((prev) => prev - 1)
    }

    const NextPage = () => {
        if (currPage === filtered.length / rowsPerPage) return;
        setCurrPage((prev) => prev + 1)
    }

    //TypeAheads
    function getVals2(events, column) {
        return [...new Set(events.filter(item => item[column].display.toLowerCase().includes(query)).map(item => item[column].display))]
    }
    const handleAgent = (e) => {
        setQuery(e.target.value)
        if (query.length > 1) {
            setDD(true)
        } else {
            setDD(false)
        }
    }

    const handleDDClick = (column,item) => {
        setQuery(item)
        setFilter(prev => ({ ...prev, [column]: { ...prev.column, display: item } }))
        setCurrPage(1)
    }
    
    //MultiSelect

    const handleCheck = (column,item) => {
        setTypes((prev) => 
            prev.includes(item) ? prev.filter((id) => id !== item) : [...prev,item]
        )
        if (types.includes(item) && item === 'Source') {
            setFilter(prev => ({ ...prev, [column]: 'Source' }))
        }
        
        //setEvents(events.filter(x => x.recordType.includes(types)))
        //console.log(filter)
    }

    return (
        <div className="grid-container">
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
                            <select className="usa-select" onChange={(e) => handleFilter('recordType', e.target.value)} value={filter.fsregionCode}>
                                <option value="">All</option>
                                {getVals(events, 'recordType').map(x => (
                                    <option key={x} value={x}>{x}</option>
                                ))}
                            </select>
                        </th>
                        <th>
                            <input type="text" className="usa-input" value={query} onChange={handleAgent} />
                            {DD && (
                                <ul style={{ position: 'absolute', backgroundColor: '#ffffff' }}>
                                    {getVals2(events, 'damageAgent').map(item =>
                                        <li key={item} onClick={() => handleDDClick('damageAgent',item)} value={item}>{item}</li>
                                    )}
                                </ul>
                            ) }
                        </th>
                        <th>
                            <select className="usa-select" onChange={(e) => handleFilter('surveyYear', e.target.value)} value={filter.surveyYear}>
                                <option value="">All</option>
                                {getVals(events, 'surveyYear').sort((a, b) => (a - b)).map(x => (
                                    <option key={x} value={x}>{x}</option>
                                ))}
                            </select>
                        </th>
                        <th>
                            <select className="usa-select" onChange={(e) => handleFilter('fsregionCode', e.target.value)} value={filter.fsregionCode}>
                                <option value="">All</option>
                                {getVals(events, 'fsregionCode').sort((a,b) => (a-b)).map(x => (
                                    <option key={x} value={x}>{x}</option>
                                ))}
                            </select>
                        </th>
                        <th>
                            <select className="usa-select" onChange={(e) => handleFilter('submitterName', e.target.value)} value={filter.submitterName}>
                                <option value="">All</option>
                                {getVals(events, 'submitterName').map(x => (
                                    <option key={x} value={x}>{x}</option>
                                ))}
                            </select>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {slick.map((x,index) =>
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
            <div>
                <button onClick={PrevPage}>Prev</button>
                <button onClick={NextPage} disabled={slick.length < 25 }>Next</button>
                <h2>Selected Rows: {filtered.length}</h2>
            </div>
        </div>
    )
}

export default TestTable;

  

