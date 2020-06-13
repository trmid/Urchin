/// <reference path="./Quaternion.ts" />
/// <reference path="./Vector.ts" />
/// <reference path="./List.ts" />
/// <reference path="./Light.ts" />
/// <reference path="./Fragment.ts" />

class Urbject {
    static PARENT = 0;
    static MESH_URBJECT = 1;
    static AMBIENT_LIGHT = 2;
    static DIRECTIONAL_LIGHT = 3;
    static POINT_LIGHT = 4;
    static CAMERA = 5;

    static DYNAMIC = 100;
    static STATIC = 101;
    static BILLBOARD = 102;
    static Z_BILLBOARD = 103;
    static X_BILLBOARD = 104;
    static Y_BILLBOARD = 105;

    static DEFAULT_GROUP = 100;

    type: number;
    position: Vector;
    orientation: Quaternion;
    scaleVector: Vector;
    children: Array<Urbject>;
    parent: Urbject;
    state: number;
    group: number;

    protected instanceCache: FrameInstance;

    constructor({
        type = Urbject.PARENT,
        position = new Vector(),
        orientation = new Quaternion(),
        scale = 1.0,
        superCopy,
        state = Urbject.DYNAMIC,
        group = 0
    }: {
        type?: number,
        position?: Vector,
        orientation?: Quaternion,
        scale?: number | Vector,
        superCopy?: Urbject,
        state?: number,
        group?: number
    } = {}) {
        if (superCopy) {
            this.type = superCopy.type;
            this.position = superCopy.position;
            this.orientation = superCopy.orientation;
            this.scaleVector = superCopy.scaleVector;
            this.children = superCopy.children;
            this.parent = superCopy.parent;
            this.state = superCopy.state;
            this.group = superCopy.group;
        } else {
            this.type = type;
            this.position = position;
            this.orientation = orientation.normalize();
            this.scaleVector = (typeof scale === "number" ? new Vector(scale, scale, scale) : scale);
            this.children = new Array<Urbject>();
            this.parent = undefined;
            this.state = state;
            this.group = group;
        }
    }

    translate(v: Vector) {
        this.position.add(v);
        return this;
    }

    scale(a: number | Vector) {
        this.scaleVector.mult(a);
        return this;
    }

    setScale(a: number | Vector) {
        this.scaleVector = (typeof a === "number" ? new Vector(a, a, a) : a);
        return this;
    }

    addChild(c: Urbject) {
        if (c.parent) {
            c.parent.removeChild(c);
        }
        c.parent = this;
        this.children.push(c);
        return c;
    }

    removeChild(c: Urbject) {
        var removed: Urbject = null;
        this.children = this.children.filter(function (urb) {
            let found = (urb === c);
            if (found) {
                urb.parent = undefined;
                removed = urb;
            }
            return removed;
        });
        return removed;
    }

    getInstance(camera: Camera) {
        if (this.state == Urbject.STATIC && this.instanceCache) {
            return this.instanceCache;
        }

        let lights = new List<Light>();
        let frags = new List<Fragment>();

        for (let i = 0; i < this.children.length; i++) {
            var childInstance: FrameInstance;
            switch (this.children[i].type) {
                case Urbject.MESH_URBJECT:
                    childInstance = (<MeshUrbject>this.children[i]).getInstance(camera);
                    break;

                case Urbject.PARENT:
                    childInstance = this.children[i].getInstance(camera);
                    break;

                case Urbject.DIRECTIONAL_LIGHT:
                    childInstance = (<DirectionalLight>this.children[i]).getInstance(camera);
                    break;

                case Urbject.AMBIENT_LIGHT:
                    childInstance = (<AmbientLight>this.children[i]).getInstance(camera);
                    break;

                case Urbject.POINT_LIGHT:
                    childInstance = (<PointLight>this.children[i]).getInstance(camera);
                    break;

                case Urbject.CAMERA:
                    childInstance = (<Camera>this.children[i]).getInstance(camera);
            }

            // translate all children to this objects transform

            var current = childInstance.lights.head;
            while (current) {
                let light = current.data.copy();
                light.applyTransform(this);
                lights.addLast(light);
                current = current.nxt;
            }

            var current = childInstance.fragments.head;
            while (current) {
                let frag = current.data;
                let t = Trigon.applyTransform(frag.trigon, this);
                frags.addLast(new Fragment(t, frag.material, frag.group));
                current = current.nxt;
            }
        }

        let instance = new FrameInstance(frags, lights);

        if (this.state == Urbject.STATIC) {
            this.instanceCache = instance;
        }

        return instance;
    }

    applyTransform(transform: Urbject) {
        this.scale(transform.scaleVector);
        this.position.mult(transform.scaleVector).quaternionRotate(transform.orientation).add(transform.position);
        this.orientation.quaternionRotate(transform.orientation);
        return this;
    }

    getWorldTransform() {
        let parent = this.parent;
        let transform = this.copy({ shallow: true });
        while (parent) {
            transform.scale(parent.scaleVector);
            transform.position.mult(parent.scaleVector).quaternionRotate(parent.orientation).add(parent.position);
            transform.orientation.quaternionRotate(parent.orientation);
            parent = parent.parent;
        }
        return transform;
    }

    copy(options = { shallow: false }) {
        let copy = new Urbject({
            type: this.type,
            position: this.position.copy(),
            orientation: this.orientation.copy(),
            scale: this.scaleVector.copy(),
            state: this.state,
            group: this.group
        });
        if (!options.shallow) {
            for (let i = 0; i < this.children.length; i++) {
                let child = this.children[i];
                switch (child.type) {
                    case Urbject.PARENT: copy.addChild(child.copy()); break;
                    case Urbject.MESH_URBJECT: copy.addChild((<MeshUrbject>child).copy()); break;
                    case Urbject.DIRECTIONAL_LIGHT: copy.addChild((<DirectionalLight>child).copy()); break;
                    case Urbject.AMBIENT_LIGHT: copy.addChild((<AmbientLight>child).copy()); break;
                    case Urbject.POINT_LIGHT: copy.addChild((<PointLight>child).copy()); break;
                    case Urbject.CAMERA: copy.addChild((<Camera>child).copy()); break;
                }
            }
        }
        return copy;
    }

    static addChild(u: Urbject, c: Urbject) {
        return u.copy().addChild(c);
    }

    static removeChild(u: Urbject, c: Urbject) {
        return u.copy().removeChild(c);
    }

    static applyTransform(target: Urbject, transform: Urbject) {
        return target.copy().applyTransform(transform);
    }

    static getWorldTransform(u: Urbject) {
        return u.getWorldTransform();
    }

    static getInstance(u: Urbject, camera: Camera) {
        return u.getInstance(camera);
    }

    static translate(u: Urbject, v: Vector) {
        return u.translate(v);
    }

    static scale(u: Urbject, a: number | Vector) {
        return u.copy().scale(a);
    }

    static setScale(u: Urbject, a: number | Vector) {
        return u.setScale(a);
    }

    static copy(u: Urbject, options = { typeCheck: true, shallow: false }): Urbject {

        if (options.typeCheck) {
            switch (u.type) {
                case Urbject.PARENT: break; //return standard Urbject copy
                case Urbject.MESH_URBJECT: return MeshUrbject.copy(<MeshUrbject>u, options);
                case Urbject.DIRECTIONAL_LIGHT: return DirectionalLight.copy(<DirectionalLight>u, options);
                case Urbject.AMBIENT_LIGHT: return AmbientLight.copy(<AmbientLight>u, options);
                case Urbject.POINT_LIGHT: return PointLight.copy(<PointLight>u, options);
                case Urbject.CAMERA: return Camera.copy(<Camera>u, options);
            }
        }

        let copy = new Urbject({
            type: u.type,
            position: Vector.copy(u.position),
            orientation: Quaternion.copy(u.orientation),
            scale: Vector.copy(u.scaleVector),
            state: u.state,
            group: u.group
        });

        if (!options.shallow) {
            for (let i = 0; i < u.children.length; i++) {
                let child = u.children[i];
                switch (child.type) {
                    case Urbject.PARENT: copy.addChild(Urbject.copy(child, options)); break;
                    case Urbject.MESH_URBJECT: copy.addChild(MeshUrbject.copy(<MeshUrbject>child, options)); break;
                    case Urbject.DIRECTIONAL_LIGHT: copy.addChild(DirectionalLight.copy(<DirectionalLight>child, options)); break;
                    case Urbject.AMBIENT_LIGHT: copy.addChild(AmbientLight.copy(<AmbientLight>child, options)); break;
                    case Urbject.POINT_LIGHT: copy.addChild(PointLight.copy(<PointLight>child, options)); break;
                    case Urbject.CAMERA: copy.addChild(Camera.copy(<Camera>child, options)); break;
                }
            }
        }

        return copy;
    }

}