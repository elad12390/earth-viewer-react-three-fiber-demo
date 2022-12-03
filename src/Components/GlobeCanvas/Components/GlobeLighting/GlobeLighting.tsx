import React from "react";

export function GlobeLighting() {
    return <>
        <ambientLight intensity={0.1}/>
        <directionalLight color="white" position={[0, 0, 5]} intensity={.4}/>
    </>;
}
