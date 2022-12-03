import React, {FC, Suspense, useCallback, useContext, useState} from "react";
import {Canvas} from "@react-three/fiber";
import {OrbitControls, Stars} from '@react-three/drei';
import majorCities from '../../assets/majorCities.json';
import {GlobeLocationMesh} from "./Components/GlobeLocationMesh/GlobeLocationMesh";
import {GlobeMesh} from "./Components/GlobeMesh/GlobeMesh";
import {GlobeEffects} from "./Components/GlobeEffects/GlobeEffects";
import {ThreeJSClickEventHandler} from "./GlobeCanvas.interface";
import {GlobeLighting} from "./Components/GlobeLighting/GlobeLighting";
import {MajorCityLocation} from "./Components/GlobeLocationMesh/GlobeLocationMesh.interface";
import {AppContext} from "../../App";


export const GlobeCanvas: FC<{className: string}> = ({className}) => {
    const {setSelectedLocation, selectedLocation} = useContext(AppContext);

    const locationClickHandler = useCallback((location: MajorCityLocation) => {
        return ((e) => {
            e.stopPropagation();
            setSelectedLocation(location);
        }) as ThreeJSClickEventHandler
    }, [setSelectedLocation])

    const globeClickHandler: ThreeJSClickEventHandler = useCallback(() => setSelectedLocation(null), [setSelectedLocation]);

    return (
        <div className={className}>
            <Canvas>
                {/*<OrbitControls/>*/}
                <GlobeLighting/>
                <GlobeEffects/>
                <Stars saturation={1}/>
                <Suspense fallback={null}>
                    <GlobeMesh size={3.1} onDoubleClick={globeClickHandler} selectedLocation={selectedLocation}>
                        {majorCities.map((location) => {
                            const {lat, lon, id, population} = location;
                            return (
                                <GlobeLocationMesh
                                    key={id}
                                    latitudeLongitude={{lat, lon}}
                                    onClick={locationClickHandler(location)}
                                    isSelected={(selectedLocation && selectedLocation.id === location.id) ?? false}
                                    population={population}
                                    globeRadius={0}
                                />
                            );
                        })}
                    </GlobeMesh>
                </Suspense>
            </Canvas>
        </div>
    );
}
