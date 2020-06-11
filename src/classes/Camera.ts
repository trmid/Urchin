/// <reference path="./Quaternion.ts" />
/// <reference path="./Vector.ts" />
/// <reference path="./Num.ts" />
/// <reference path="./Urbject.ts" />

class Camera extends Urbject {

    fov: number;

    constructor({
        orientation = Quaternion.fromAxisRotation(Vector.X_AXIS, 0),
        position = new Vector(-10, 0, 0),
        scale,
        fov = 60,
        superCopy,
        state,
        group
    }: {
        orientation?: Quaternion,
        position?: Vector,
        scale?: number | Vector,
        fov?: number,
        superCopy?: Urbject,
        state?: number,
        group?: number
    } = {}) {
        super({ type: Urbject.CAMERA, position: position, orientation: orientation, scale: scale, superCopy: superCopy, state: state, group: group });
        this.fov = Num.constrain(fov, 1, 360);
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