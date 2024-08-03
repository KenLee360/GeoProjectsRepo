import { useState, useEffect, useRef } from "react";
import './MultiSelect.css'

const MultiSelect = ({ options, onChange, initial, hidden }) => {

    const [filter, setFilter] = useState(options)
    const [inputVal, setInputVal] = useState('');
    const [selectedVals, setSelectedVals] = useState([])
    const [showDD, setShowDD] = useState(false);
    const dropdownRef = useRef(null);


    useEffect(() => {
        setSelectedVals(initial)
    }, [initial])

    useEffect(() => {
        setFilter(options.filter(txt => txt.commonName.toLowerCase().includes(inputVal.toLowerCase())
            && !selectedVals.some(phd => phd.display === txt.commonName)
        ))

    }, [inputVal, options, selectedVals])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDD(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousdown', handleClickOutside)
        }
    }, [])

    const handleInputChange = (e) => {
        setInputVal(e.target.value);
        setShowDD(true);
    }

    const handleSelectedOption = (option) => {
        if (!selectedVals.some(x => x.hostCode === option.hostCode)) {
            const returnVal = {
                childID: option.hostCode,
                display: option.commonName
            }
            const newSelection = [...selectedVals, returnVal];
            setSelectedVals(newSelection);
            onChange(newSelection);
        }
        setInputVal('')
        setShowDD(false)
    }

    const handleRemoveOption = (option) => {
        const newSelected = selectedVals.filter(x => x.childID !== option.childID)
        setSelectedVals(newSelected);
        onChange(newSelected);
    }

    return (
        <div className={hidden ? "none" : "multiSel"} >
            <div className="selected">
                {selectedVals.length > 0 && selectedVals.map(option => (
                    <div key={`${option.childID}-${option.display}`} className="selected2">{option.display}
                        <button type="button" onClick={() => handleRemoveOption(option)}>&times;</button>
                    </div>
                ))}
                <input type="text" value={inputVal} onChange={handleInputChange} onFocus={() => setShowDD(true)} placeholder="Start Typing Common Name" />
            </div>
            {showDD && (
                <div className="dropdown" ref={dropdownRef}>
                    {filter.map(option => (
                        <div key={option.hostCode} className="dropdown-item" onClick={() => handleSelectedOption(option)}>{option.commonName}</div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MultiSelect;
