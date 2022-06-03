/// <reference path="./Quaternion.ts" />
/// <reference path="./Vector.ts" />
/// <reference path="./Num.ts" />
/// <reference path="./Urbject.ts" />

class Camera extends Urbject {

    fov: number;
    nearClip: number;

    constructor({
        orientation = Quaternion.fromAxisRotation(Vector.X_AXIS, 0),
        position = new Vector(-10, 0, 0),
        scale,
        fov = 60,
        nearClip = 1,
        superCopy,
        state,
        group
    }: {
        orientation?: Quaternion,
        position?: Vector,
        scale?: number | Vector,
        fov?: number,
        nearClip?: number,
        superCopy?: Urbject,
        state?: number,
        group?: number
    } = {}) {
        super({ type: Urbject.CAMERA, position: position, orientation: orientation, scale: scale, superCopy: superCopy, state: state, group: group });
        if(fov <= 0 || fov >= 180) throw new Error("The FOV must be between 0 and 180 non-inclusive.");
        this.fov = fov;
        if(nearClip <= 0) throw new Error("The near clipping distance must be greater than zero.");
        this.nearClip = nearClip;
    }

    copy(options = { shallow: false }) {
        return new Camera({
            superCopy: super.copy(options),
            fov: this.fov
        });
    }

    static copy(c: Camera, options = { shallow: false }) {
        let superCopy = Urbject.copy(c, { typeCheck: false, shallow: options.shallow });
        let copy = new Camera({
            superCopy: superCopy,
            fov: c.fov
        });
        return copy;
    }
}