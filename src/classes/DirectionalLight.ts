/// <reference path="./Urbject.ts" />
/// <reference path="./Light.ts" />
/// <reference path="./Color.ts" />
/// <reference path="./Vector.ts" />
/// <reference path="./Quaternion.ts" />
/// <reference path="./Trigon.ts" />
/// <reference path="./Camera.ts" />

class DirectionalLight extends Urbject implements Light {

    brightness: number;
    color: Color;

    constructor({
        direction = new Vector(1, 1, -4),
        brightness = 1.1,
        color = new Color("WHITE"),
        superCopy,
        state,
        group
    }: {
        direction?: Vector,
        brightness?: number,
        color?: Color,
        superCopy?: Urbject,
        state?: number,
        group?: number
    } = {}) {
        super({ type: Urbject.DIRECTIONAL_LIGHT, superCopy: superCopy, orientation: Quaternion.fromVector(direction), state: state, group: group });
        this.brightness = brightness;
        this.color = color;
    }

    getInstance(camera: Camera) {
        if (!this.instanceCache) {
            let instance = super.getInstance(camera);
            instance.lights.addFirst(this.copy({ shallow: true }));
            return instance;
        }
        return super.getInstance(camera);
    }

    intensityOn(t: Trigon) {
        let norm = t.getNormal();
        return Num.constrain((Vector.quaternionRotate(Vector.axis(Vector.X_AXIS), this.orientation).angleBetween(norm) - Math.PI / 2) / (Math.PI / 2), 0, 1) * this.brightness;
    }

    copy(options = { shallow: false }) {
        let superCopy = super.copy(options);
        let copy = new DirectionalLight({
            superCopy: superCopy,
            color: this.color.copy(),
            brightness: this.brightness
        });
        return copy;
    }

    static intensityOn(l: Light, t: Trigon) {
        return l.intensityOn(t);
    }

    static copy(d: DirectionalLight, options = { shallow: false }) {
        let superCopy = Urbject.copy(d, { typeCheck: false, shallow: options.shallow });
        let copy = new DirectionalLight({
            superCopy: superCopy,
            color: Color.copy(d.color),
            brightness: d.brightness
        });
        return copy;
    }
}