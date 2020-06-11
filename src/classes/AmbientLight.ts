/// <reference path="./Camera.ts" />
/// <reference path="./Color.ts" />
/// <reference path="./Light.ts" />
/// <reference path="./Trigon.ts" />
/// <reference path="./Urbject.ts" />

class AmbientLight extends Urbject implements Light {

    /**
     * The Ambient Light that can be specified for a Uorld. If brightness is 0, there will be no light added from this object
     * @param brightness The scalar brightness of the light
     * @param color The color of the light
     */

    brightness: number;
    color: Color;


    constructor({
        brightness = 0.6,
        color = new Color("WHITE"),
        superCopy,
        state,
        group
    }: {
        brightness?: number,
        color?: Color,
        superCopy?: Urbject,
        state?: number,
        group?: number
    } = {}) {
        super({ type: Urbject.AMBIENT_LIGHT, superCopy: superCopy, state: state, group: group });
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
        return this.brightness;
    }

    copy(options = { shallow: false }) {
        let superCopy = super.copy(options);
        let copy = new AmbientLight({
            brightness: this.brightness,
            color: this.color.copy(),
            superCopy: superCopy
        });
        return copy;
    }

    static intensityOn(l: Light, t: Trigon) {
        return l.intensityOn(t);
    }

    static copy(a: AmbientLight, options = { shallow: false }) {
        let superCopy = Urbject.copy(a, { typeCheck: false, shallow: options.shallow });
        let copy = new AmbientLight({
            brightness: a.brightness,
            color: Color.copy(a.color),
            superCopy: superCopy
        });
        return copy;
    }
}