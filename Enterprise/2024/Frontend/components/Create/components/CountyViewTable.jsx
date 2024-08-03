import { useState, useEffect } from "react"
import { getCounties } from "../../../services/References"
import Modal from "react-bootstrap/Modal"

const ViewTable = ({ show, onHide, initial }) => {

    const [newCounties, setNewCounties] = useState([])
    const [refCounty, setRefCounty] = useState([]);
    const [sortAsc, setSortAsc] = useState(true)
    const [FIPS,setFIPS] = useState([])
    const [damageYes, setDamageYes] = useState([])
    const [damageNo, setDamageNo] = useState([])

    useEffect(() => {
        setDamageYes(initial.filter(x => x.isCausingDamage == true).map(y => y.fips))
        setDamageNo(initial.filter(x => x.isCausingDamage == false).map(y => y.fips))
        setFIPS(initial.map(t=>t.fips))
    }, [initial])

    useEffect(() => {
        const fetchCounties = async () => {
            const county = await getCounties();
            setRefCounty(county);
        }

        fetchCounties()
    },[])

    useEffect(() => {
        setNewCounties(refCounty.filter(r => FIPS.includes(r.countyFips)).map(x =>
            damageYes.includes(x.countyFips) ? { ...x, causingDamage: 'Yes' } : damageNo.includes(x.countyFips) ? { ...x, causingDamage: 'No' } : x))
    }, [damageNo, damageYes, initial, refCounty,FIPS])

    const orderyByFips = () => {
        const sortedCounties = [...newCounties].sort((a, b) => {
            if (a.countyFips < b.countyFips) return sortAsc ? -1 : 1;
            if (a.countyFips > b.countyFips) return sortAsc ? 1 : -1;
            return 0;
        })
        setSortAsc(!sortAsc)
        setNewCounties(sortedCounties)
    }

    const FIPSStyles = {
        color: 'green',
        textDecoration: 'underline',
        textAlign: 'center',
        cursor: 'pointer'
    }

    function OnHideTable() {
        onHide()
    }

    return (
        <div>
            <Modal show={show} onHide={OnHideTable} size="lg" aria-labelledby="contained-modal-title-vcenter" centered scrollable={true}>
                <Modal.Title id="centered-modal-title-vcenter">Selected Counties</Modal.Title>
                <Modal.Body>
                    <div className="usa-table-container--scrollable">
                        <table className="usa-table" style={{ width: '100%' }}>
                            <thead style={{ textAlign: 'center', fontSize: '16px' }}>
                                <tr>
                                    <th scope="col" style={{ textAlign: 'center' }}>State</th>
                                    <th scope="col" style={{ textAlign: 'center' }}>County</th>
                                    <th scope="col" onClick={orderyByFips} style={FIPSStyles}>FIPS</th>
                                    <th scope="col" style={{ textAlign: 'center' }}>Causing Damage</th>
                                </tr>
                            </thead>
                            <tbody style={{ textAlign: 'center' }}>
                                {newCounties.map((x) =>
                                    <tr key={x.countyFips}>
                                        <td>{x.state}</td>
                                        <td>{x.county1}</td>
                                        <td>{x.countyFips}</td>
                                        <td>{x.causingDamage}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="usa-button" onClick={OnHideTable}>Close Table</button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ViewTable