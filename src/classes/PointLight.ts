/// <reference path="./Urbject.ts" />

class PointLight extends Urbject implements Light {

    radius: number;
    brightness: number;
    color: Color;

    constructor({
        radius = 10.0,
        position = new Vector(),
        brightness = 1.0,
        color = new Color("WHITE"),
        superCopy,
        state,
        group
    }: {
        radius?: number,
        position?: Vector,
        brightness?: number,
        color?: Color,
        superCopy?: Urbject,
        state?: number,
        group?: number
    } = {}) {
        super({ position: position, type: Urbject.POINT_LIGHT, superCopy: superCopy, state: state, group: group });
        this.radius = radius;
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
        // let diff = Vector.sub(this.position.closest([t.v0, t.v1, t.v2]), this.position);
        let diff = Vector.sub(t.getCenter(), this.position);
        let diffMag = Vector.quaternionRotate(diff, Quaternion.conjugate(this.orientation)).div(this.scaleVector).mag();

        let falloff = (this.radius == 0) ? 0 : Num.constrain((this.radius - diffMag) / this.radius, 0, 1);
        let norm = t.getNormal();
        return (
            falloff *
            Num.constrain((diff.angleBetween(norm) - Math.PI / 2) / (Math.PI / 2), 0, 1) *
            this.brightness
        );
    }

    copy(options = { shallow: false }) {
        let superCopy = super.copy(options);
        let copy = new PointLight({
            superCopy: superCopy,
            color: this.color.copy(),
            brightness: this.brightness,
            radius: this.radius
        });
        return copy;
    }

    static getInstance(a: AmbientLight, camera: Camera) {
        return a.getInstance(camera);
    }

    static intensityOn(l: Light, t: Trigon) {
        return l.intensityOn(t);
    }

    static copy(l: PointLight, options = { shallow: false }) {
        let superCopy = Urbject.copy(l, { typeCheck: false, shallow: options.shallow });
        let copy = new PointLight({
            superCopy: superCopy,
            color: Color.copy(l.color),
            brightness: l.brightness,
            radius: l.radius
        });
        return copy;
    }

}