import {PIOver180} from "../../../../const";
import * as THREE from "three";
import {BufferGeometry, Euler, Material, Mesh, Object3D, Quaternion, Vector3} from "three";

export const latLongToVector3 = (lat: number, lon: number, radius: number, height: number = 0) => {
    const phi = lat * PIOver180;
    const theta = (lon - 180) * PIOver180;

    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    const radiusAndHeight = radius + height;

    const x = -1 * (radiusAndHeight * cosPhi * cosTheta);
    const y = radiusAndHeight * sinPhi;
    const z = radiusAndHeight * cosPhi * sinTheta;

    return new THREE.Vector3(x, y, z);
}

// make a function that returns the globe's rotation quaternion when given a lat/long
export const latLongToRotation = (object: Mesh, lat: number, lon: number, radius: number) => {
    const worldPosition = latLongToVector3(lat, lon, radius).normalize();
    return worldPosition.normalize()
}
