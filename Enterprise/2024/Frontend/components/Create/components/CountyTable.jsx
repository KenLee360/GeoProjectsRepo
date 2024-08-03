import { useState, useEffect } from "react"
import Modal from "react-bootstrap/Modal"

const CountyPopup = ({show, onHide, onSelect, options, initial}) => {

    const [counties, setCounties] = useState([])
    const [presetYes, setPresetYes] = useState([])
    const [presetNo, setPresetNo] = useState([])
    const [sortAsc, setSortAsc] = useState(true)


    useEffect(() => {
        setPresetYes(initial.filter(x => x.isCausingDamage == true).map(y => y.fips))
        setPresetNo(initial.filter(x => x.isCausingDamage == false).map(y => y.fips))
    },[initial])


    useEffect(() => {

        if (initial.length > 0) {
            setCounties(options.map(x =>
                presetYes.includes(x.countyFips) ? { ...x, isChecked: true, causingDamage: 'yes' }
                    : presetNo.includes(x.countyFips) ? { ...x, isChecked: true, causingDamage: 'no' } : x))
        } else {
            setCounties(options)
        }
           
    }, [options, initial, presetYes, presetNo])

    const orderyByFips = () => {
        const sortedCounties = [...counties].sort((a, b) => {
            if (a.countyFips < b.countyFips) return sortAsc ? -1 : 1;
            if (a.countyFips > b.countyFips) return sortAsc ? 1 : -1;
            return 0;
        })
        setSortAsc(!sortAsc)
        setCounties(sortedCounties)
    }

    const FIPSStyles = {
        color: 'green',
        textDecoration: 'underline',
        textAlign: 'center',
        cursor: 'pointer'
    }


    const handleCheckChange = (countyFips) => {
        setCounties(counties.map(row =>
            row.countyFips === countyFips ? { ...row, isChecked: !row.isChecked } : row
        ))
    }

    const handleDropDown = (countyFips, value) => {
        setCounties(counties.map(row =>
            row.countyFips === countyFips ? { ...row, causingDamage: value } : row
        ))
    }

    const handleSelect = () => {
        const selected = counties.filter(row => row.isChecked)
        const affected = selected.map(l => {
            return {
                fips: l.countyFips,
                isCausingDamage: l.causingDamage == null ? true : l.causingDamage == '' ? true : l.causingDamage == 'yes' ? true : false,
                wkt: ''
            }
        })
        onSelect(affected)   
    }

    const OnHideTable = () => {
        handleSelect()
        onHide()
    }

    return (
        <div>
            <Modal show={show} onHide={OnHideTable} size="lg" aria-labelledby="contained-modal-title-vcenter" centered scrollable={true}>
                <Modal.Title id="centered-modal-title-vcenter">Choose Counties</Modal.Title>
                <Modal.Body>
                    <table className="usa-table" style={{width: '100%' }}>
                        <thead style={{ textAlign: 'center' }}>
                            <tr>
                                <th scope="col" style={{ textAlign: 'center' }}>Select</th>
                                <th scope="col" style={{ textAlign: 'center' }}>State</th>
                                <th scope="col" style={{ textAlign: 'center' }}>County</th>
                                <th scope="col" onClick={orderyByFips} style={FIPSStyles}>FIPS</th>
                                <th scope="col" style={{ textAlign: 'center' }}>Causing Damage</th>
                            </tr>
                        </thead>
                        <tbody style={{ textAlign: 'center' }}>
                            {counties.map(row =>
                                <tr key={row.countyFips}>
                                    <td>
                                        <input type="checkbox" checked={row.isChecked} onChange={() => handleCheckChange(row.countyFips)} />
                                    </td>
                                    <td>{row.state}</td>
                                    <td>{row.county1}</td>
                                    <td>{row.countyFips}</td>
                                    <td>
                                        <select value={row.causingDamage || ''} onChange={(e) => handleDropDown(row.countyFips, e.target.value)}>
                                            <option value='yes'>Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table> 
                </Modal.Body>
                <Modal.Footer>
                    <button className="usa-button" onClick={OnHideTable}>Save and Close</button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CountyPopup