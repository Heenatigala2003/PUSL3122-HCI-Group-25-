/**
 * Utility to map 2D Canvas coordinates to 3D Three.js space.
 * 
 * In 2D Konva: (0,0) is top-left, x increases right, y increases down.
 * In 3D Three.js: (0,0,0) is center, x increases right, z increases forward, y increases up (top).
 */

export interface Vector2D {
    x: number;
    y: number;
}

export interface Vector3D {
    x: number;
    y: number;
    z: number;
}

export const map2Dto3D = (
    coords: Vector2D,
    roomDimensions: { width: number; height: number },
    pixelsPerUnit: number = 50
): Vector3D => {
    // 1. Convert pixel coordinates to meter units
    const xUnits = coords.x / pixelsPerUnit;
    const zUnits = coords.y / pixelsPerUnit;

    // 2. Map to center-aligned Three.js space
    // We assume the room floor is at y = 0
    const threeX = xUnits - (roomDimensions.width / 2);
    const threeZ = zUnits - (roomDimensions.height / 2);

    return {
        x: threeX,
        y: 0, // Ground level
        z: threeZ
    };
};

export const map3Dto2D = (
    coords: Vector3D,
    roomDimensions: { width: number; height: number },
    pixelsPerUnit: number = 50
): Vector2D => {
    const xUnits = coords.x + (roomDimensions.width / 2);
    const zUnits = coords.z + (roomDimensions.height / 2);

    return {
        x: xUnits * pixelsPerUnit,
        y: zUnits * pixelsPerUnit
    };
};
