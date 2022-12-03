import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {BufferGeometry, Euler, Mesh, Quaternion, TextureLoader, Vector3} from "three";
import {useFrame, useLoader} from "@react-three/fiber";
import EarthTexture from "../../../../assets/2k_earth_daymap.jpg";
import {ThreeJSClickEventHandler} from "../../GlobeCanvas.interface";
import {useAnimations} from "@react-three/drei";
import { useSpring, animated } from '@react-spring/three'
import {MajorCityLocation} from "../GlobeLocationMesh/GlobeLocationMesh.interface";
import {latLongToRotation, latLongToVector3} from "../GlobeLocationMesh/GlobeLocationMesh.util";

export interface GlobeProps {
    children?: React.ReactNode;
    size?: number;
    onDoubleClick?: ThreeJSClickEventHandler;
    selectedLocation: MajorCityLocation | null;
}

const initialLat = 41.9028;
const initialLon = 12.4964;

export const GlobeMesh: FC<GlobeProps> = ({
                                       children: globeChildren,
                                       size,
                                       onDoubleClick,
                                       selectedLocation
                                   }) => {
    const ref = useRef<{ value: Mesh | null }>({value: null});
    const [globeMesh, setGlobeMesh] = React.useState<Mesh | null>();
    const earthTexture = useLoader(TextureLoader, EarthTexture);
    const currentSize = useMemo(() => size ?? 0.5, [size]);
    const constantRotationYRef = useRef(0);

    const children = React.Children.map(globeChildren, (child) => React.cloneElement(child as React.ReactElement, {
        parent: globeMesh,
        globeRadius: currentSize,
        size: currentSize / 70
    }));

    const {calculatedRotationX, calculatedRotationY} = useMemo(() => {
        const lon = selectedLocation?.lon ?? initialLon;
        const lat = selectedLocation?.lat ?? initialLat;

        return {
            calculatedRotationX: lat * (Math.PI / 180),
            calculatedRotationY: -(Math.PI * (lon+90))/180
        };
    }, [selectedLocation, globeMesh]);

    useEffect(() => {
        if (selectedLocation) {
            constantRotationYRef.current = calculatedRotationY;
        }
    }, [selectedLocation])

    const [{ rotationX, rotationY, rotationZ }] = useSpring({
        rotationX: calculatedRotationX,
        rotationY: calculatedRotationY,
        rotationZ: 0,
        config: { mass: 1, tension: 350, friction: 100 }
    }, [selectedLocation, calculatedRotationY, calculatedRotationX])


    return (<>
        <animated.mesh
            visible={true}
            castShadow={true}
            ref={(newRef) => {
                setGlobeMesh(newRef);
                ref.current.value = newRef;
            }}
            rotation-x={rotationX}
            rotation-y={rotationY}
            rotation-z={rotationZ}
            onDoubleClick={onDoubleClick}>
            <sphereGeometry args={[size, 64, 64]}/>
            <meshStandardMaterial
                map={earthTexture}
                color={"white"}
            />
        </animated.mesh>
        {children}
    </>);
}
