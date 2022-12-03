import React, {useState} from 'react';
import './App.scss'
import {GlobeCanvas} from "./Components/GlobeCanvas/GlobeCanvas";
import {MajorCityLocation} from "./Components/GlobeCanvas/Components/GlobeLocationMesh/GlobeLocationMesh.interface";
import {LocationDetails} from "./Components/LocationDetails/LocationDetails";

interface AppContextData {
    selectedLocation: MajorCityLocation | null;
    setSelectedLocation: (location: MajorCityLocation | null) => void;
}

export const AppContext = React.createContext<AppContextData>({
    selectedLocation: null, setSelectedLocation: () => {
    }
});

function App() {
    const [selectedLocation, setSelectedLocation] = useState<MajorCityLocation | null>(null);

    return (
        <AppContext.Provider value={{selectedLocation, setSelectedLocation}}>
            <div className="App">
                <h1>Earth Viewer Demo</h1>
                <LocationDetails/>
            </div>
            <GlobeCanvas className={"globeCanvas"}/>
        </AppContext.Provider>
    )
}

export default App
