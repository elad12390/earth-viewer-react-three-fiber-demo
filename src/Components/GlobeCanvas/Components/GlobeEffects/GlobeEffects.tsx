import React, {FC, useMemo} from "react";
import {extend, useThree} from "@react-three/fiber";
import * as THREE from "three";
import {Effects as EffectsComposer} from "@react-three/drei";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";

extend({ UnrealBloomPass, RenderPass });

export const GlobeEffects: FC = () => {
    const {size, scene, camera} = useThree();

    const aspect = useMemo(
        () => new THREE.Vector2(size.width, size.height),
        [size]
    );

    return (
        <EffectsComposer
            multisamping={8}
            renderIndex={1}
            disableGamma
            disableRenderPass>
            {/* @ts-ignore */}
            <renderPass attachArray="passes" scene={scene} camera={camera}/>
            {/* @ts-ignore */}
            <unrealBloomPass attachArray="passes" args={[aspect, 0.4, 1, 0]}/>
        </EffectsComposer>
    )
}
