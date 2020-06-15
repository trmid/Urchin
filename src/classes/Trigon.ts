/// <reference path="./Urbject.ts" />

class Trigon {
    constructor(public v0: Vector = new Vector(), public v1: Vector = new Vector(), public v2: Vector = new Vector()) { }

    getNormal() {
        let u = Vector.sub(this.v1, this.v0);
        let v = Vector.sub(this.v2, this.v0);
        let dir = Vector.cross(u, v); //Cross Product u x v
        return dir.normalize();
    }

    rotateAxis(axis: number | Vector, angle: number) {
        this.v0.rotateAxis(axis, angle);
        this.v1.rotateAxis(axis, angle);
        this.v2.rotateAxis(axis, angle);
        return this;
    }

    rotateX(angle: number) {
        return this.rotateAxis(Vector.X_AXIS, angle);
    }

    rotateY(angle: number) {
        return this.rotateAxis(Vector.Y_AXIS, angle);
    }

    rotateZ(angle: number) {
        return this.rotateAxis(Vector.Z_AXIS, angle);
    }

    qRotate(q: Quaternion) {
        return this.quaternionRotate(q);
    }

    quaternionRotate(q: Quaternion) {
        this.v0.quaternionRotate(q);
        this.v1.quaternionRotate(q);
        this.v2.quaternionRotate(q);
        return this;
    }

    translate(v: Vector) {
        this.v0.add(v);
        this.v1.add(v);
        this.v2.add(v);
        return this;
    }

    transform(M: Array<Array<number>>) {
        this.v0.transform(M);
        this.v1.transform(M);
        this.v2.transform(M);
        return this;
    }

    scale(s: number | Vector) {
        this.v0.mult(s);
        this.v1.mult(s);
        this.v2.mult(s);
        return this;
    }

    getCenter() {
        return new Vector(Num.avg([this.v0.x, this.v1.x, this.v2.x]), Num.avg([this.v0.y, this.v1.y, this.v2.y]), Num.avg([this.v0.z, this.v1.z, this.v2.z]));
    }

    applyTransform(transform: Urbject) {
        return this.quaternionRotate(transform.orientation).scale(transform.scaleVector).translate(transform.position);
    }

    inverseNormal() {
        let temp = this.v0;
        this.v0 = this.v1;
        this.v1 = temp;
        return this;
    }

    copy() {
        return new Trigon(this.v0.copy(), this.v1.copy(), this.v2.copy());
    }

    static applyTransform(target: Trigon, transform: Urbject) {
        return target.copy().applyTransform(transform);
    }

    static getNormal(t: Trigon) {
        return t.getNormal();
    }

    static rotateAxis(t: Trigon, axis: number, angle: number) {
        return t.copy().rotateAxis(axis, angle);
    }

    static rotateX(t: Trigon, angle: number) {
        return t.copy().rotateX(angle);
    }

    static rotateY(t: Trigon, angle: number) {
        return t.copy().rotateY(angle);
    }

    static rotateZ(t: Trigon, angle: number) {
        return t.copy().rotateZ(angle);
    }

    static qRotate(t: Trigon, q: Quaternion) {
        return Trigon.quaternionRotate(t, q);
    }

    static quaternionRotate(t: Trigon, q: Quaternion) {
        return t.copy().quaternionRotate(q);
    }

    static translate(t: Trigon, v: Vector) {
        return t.copy().translate(v);
    }

    static transform(t: Trigon, M: Array<Array<number>>) {
        return t.copy().transform(M);
    }

    static scale(t: Trigon, s: number | Vector) {
        return t.copy().scale(s);
    }

    static getCenter(t: Trigon) {
        return t.getCenter();
    }

    static inverseNormal(t: Trigon) {
        return t.copy().inverseNormal();
    }

    static copy(t: Trigon) {
        return new Trigon(
            Vector.copy(t.v0),
            Vector.copy(t.v1),
            Vector.copy(t.v2)
        );
    }
}