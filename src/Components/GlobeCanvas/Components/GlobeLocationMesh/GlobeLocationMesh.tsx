import React, {FC, useCallback, useContext, useEffect, useMemo, useRef} from "react";
import {Mesh, MeshStandardMaterial, Object3D, Vector3} from "three";
import {latLongToVector3} from "./GlobeLocationMesh.util";
import {ThreeJSClickEventHandler} from "../../GlobeCanvas.interface";
import {animated, SpringToFn, useSpring} from "@react-spring/three";

const SELECTED_COLOR = 0x8DE969;
const DEFAULT_COLOR = 0x72A98F;


interface GlobeLocationProps {
    parent?: Object3D;
    size?: number;
    globeRadius: number;
    latitudeLongitude: { lat: number; lon: number; };
    onClick?: ThreeJSClickEventHandler;
    isSelected?: boolean;
    population: number;
}

export const GlobeLocationMesh: FC<GlobeLocationProps> = ({parent, size, globeRadius, population, latitudeLongitude, onClick, isSelected}) => {
    const ref = useRef<Mesh>(null);

    const meshSize = useMemo(() => size ?? 0.01, [size]);
    const meshPosition = useMemo(
        () => latLongToVector3(latitudeLongitude.lat, latitudeLongitude.lon, globeRadius, 0),
        [latitudeLongitude, globeRadius]
    );

    const handleAttachToParent = useCallback((parent: Object3D) => {
        if (!ref.current) return;

        ref.current.parent = parent;
        ref.current.position.set(meshPosition.x, meshPosition.y, meshPosition.z);
        ref.current.lookAt(0, 0, 0);
        ref.current.rotateOnAxis(new Vector3(1, 0, 0), Math.PI/2);
    }, [meshPosition])

    useEffect(() => {
        if (!ref.current || !parent) return;
        handleAttachToParent(parent);
    }, [parent])

    const handleIsSelectedColorChange = useCallback((isSelected: boolean) => {
        if (!ref.current) return;
        const material = ref.current.material as MeshStandardMaterial;

        material.color.set(isSelected ? SELECTED_COLOR : DEFAULT_COLOR);
    }, []);

    useEffect(() => {
        if (!ref.current) return;
        handleIsSelectedColorChange(Boolean(isSelected));
    }, [isSelected])

    const baseScale = useMemo(() => {
        const log = Math.log2(population);
        if (log > 0) {
            return log / 15
        } else {
            return .1;
        }
    }, [population]);

    const [{scale}] = useSpring({
        loop: true,
        from: { scale: baseScale },
        to: useCallback((async (next) => {
            await next({ scale: baseScale });
            await next({ scale: (baseScale*1.1) });
            await next({ scale: baseScale });
        }) as SpringToFn<{ scale: number }>, [baseScale]),
        config: {duration: 1000},
    }, [baseScale])

    return (<>
        <animated.mesh onClick={onClick}
              visible={true}
              castShadow={true}
              ref={ref}
              parent={parent}
              scale={scale}>
            <cylinderGeometry args={[meshSize, meshSize / 2, meshSize / 2]}/>
            <meshStandardMaterial/>
        </animated.mesh>
    </>)
}
