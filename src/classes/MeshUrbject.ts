/// <reference path="./Mesh.ts" />
/// <reference path="./Urbject.ts" />
/// <reference path="./Material.ts" />
/// <reference path="./Camera.ts" />
/// <reference path="./List.ts" />
/// <reference path="./Fragment.ts" />
/// <reference path="./FrameInstance.ts" />

class MeshUrbject extends Urbject {

    mesh: Mesh;
    material: Material;

    constructor({
        position,
        orientation,
        scale,
        state,
        group,
        mesh = new Mesh(),
        material = new Material(),
        superCopy
    }: {
        position?: Vector,
        orientation?: Quaternion,
        scale?: number | Vector,
        state?: number,
        group?: number,
        mesh?: Mesh,
        material?: Material,
        superCopy?: Urbject
    } = {}) {
        super({ type: Urbject.MESH_URBJECT, superCopy: superCopy, position: position, orientation: orientation, scale: scale, state: state, group: group });
        this.mesh = mesh;
        this.material = material;
    }

    copy() {
        let superCopy = super.copy();
        let copy = new MeshUrbject({
            superCopy: superCopy,
            mesh: this.mesh.copy(),
            material: this.material.copy()
        });
        return copy;
    }

    getInstance(camera: Camera) {
        if (this.state == Urbject.STATIC && this.instanceCache) {
            return this.instanceCache;
        }
        let frags = new List<Fragment>();
        let trigons = this.mesh.trigons;
        for (let n = 0; n < trigons.length; n++) {
            switch (this.state) {
                default:
                case Urbject.DYNAMIC:
                    var t = Trigon.scale(trigons[n], this.scaleVector).quaternionRotate(this.orientation).translate(this.position);
                    break;
                case Urbject.BILLBOARD:
                case Urbject.X_BILLBOARD:
                case Urbject.Y_BILLBOARD:
                case Urbject.Z_BILLBOARD:
                    var t = Trigon.scale(trigons[n], this.scaleVector).quaternionRotate(this.orientation);
                    var norm = Vector.axis(Vector.X_AXIS);
                    let center = this.position;
                    var diff = Vector.sub(camera.position, center);
                    if (this.state == Urbject.X_BILLBOARD) diff.x = 0;
                    if (this.state == Urbject.Y_BILLBOARD) diff.y = 0;
                    if (this.state == Urbject.Z_BILLBOARD) diff.z = 0;
                    var axis = (new Trigon(new Vector(), norm, diff)).getNormal();
                    t.quaternionRotate(Quaternion.fromAxisRotation(axis, diff.angleBetween(norm)));
                    t.translate(this.position);
                    break;
            }
            frags.addFirst(new Fragment(t, this.material, this.group + Urbject.DEFAULT_GROUP));
        }
        let childrenInstance = super.getInstance(camera);
        frags.linkLast(childrenInstance.fragments);

        let instance = new FrameInstance(frags, childrenInstance.lights);

        if (this.state == Urbject.STATIC) {
            this.instanceCache = instance;
        }
        return instance;
    }

    static copy(u: MeshUrbject, options = { shallow: false }) {
        let superCopy = Urbject.copy(u, { typeCheck: false, shallow: options.shallow });
        let copy = new MeshUrbject({
            superCopy: superCopy,
            mesh: Mesh.copy(u.mesh),
            material: Material.copy(u.material)
        });
        return copy;
    }

}