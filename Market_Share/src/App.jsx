import {Routes, Route } from "react-router-dom"
import Header from "./Components/Header.jsx"
import ViewMap from "./Components/ViewMap.jsx"
import EditMap from "./Components/EditMap.jsx"
import FeatureTable from "./Components/Table.jsx"

function App() {

    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<ViewMap />} />
                <Route path="/add" element={<EditMap />} />
                <Route path="/edit" element={<FeatureTable />} />
            </Routes>              
        </div>
    )
}

export default App
