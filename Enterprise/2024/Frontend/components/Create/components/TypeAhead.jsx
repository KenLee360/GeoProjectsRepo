import { useState, useEffect, useRef } from "react";

const TypeAhead = ({ options, onSelect, clear, initial }) => {

    const [inputVal, setInputVal] = useState('')
    const [selectedVal, setSelectedVal] = useState(null)
    const [filtered, setFiltered] = useState([])
    const [showDD, setShowDD] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setSelectedVal(initial)
    },[initial])


    useEffect(() => {
        setFiltered(
            options.filter(option => option.displayName.toLowerCase().includes(inputVal))
        );

    }, [inputVal, options])

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

    const handleAgentChange = (e) => {
        setInputVal(e.target.value)
        setShowDD(true)
    };

    const handleSelect = (option) => {
        const newVal = {
            childId: option.damageAgentCode,
            display: option.displayName
        }
        setSelectedVal(newVal)
        setInputVal(option.displayName)
        onSelect(option,newVal)
        setShowDD(false)
    };

    const handleRemoveOption = () => {
        setInputVal('')
        setSelectedVal(null);
        clear()
    }

    return (
        <div className="multiSel">
            <div className="selected">
            {selectedVal ? (
                <div key={selectedVal.childID} className="selected2">{selectedVal.display}
                    <button type="button" onClick={handleRemoveOption}>&times;</button>
                </div>
            ) : (
                    <input type="text" value={inputVal} onChange={handleAgentChange} onFocus={() => setShowDD(true)} placeholder="Start Typing Common or Scientific Name" />
            )}
            </div>
            {showDD && (
                <div className="dropdown" ref={dropdownRef}>
                    {filtered.length == 0 && inputVal != null && inputVal.length < 6 ? (
                        <div style={{ fontWeight:'bold',textAlign: 'center' }}>No Results Found</div>
                    ) : (
                        filtered.map(option => (
                            <div key={option.damageAgentCode} className="dropdown-item" onClick={() => handleSelect(option)}>{option.displayName}</div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default TypeAhead