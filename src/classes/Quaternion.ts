/// <reference path="./Vector.ts" />
/// <reference path="./Trigon.ts" />

class Quaternion {
    constructor(public a = 1, public i = 0, public j = 0, public k = 0) { }

    add(q: Quaternion) {
        this.a = this.a + q.a;
        this.i = this.i + q.i;
        this.j = this.j + q.j;
        this.k = this.k + q.k;
        return this;
    }

    sub(q: Quaternion) {
        this.a = this.a - q.a;
        this.i = this.i - q.i;
        this.j = this.j - q.j;
        this.k = this.k - q.k;
        return this;
    }

    conjugate() {
        this.i = -this.i;
        this.j = -this.j;
        this.k = -this.k;
        return this;
    }

    mult(a: number) {
        this.a = this.a * a;
        this.i = this.i * a;
        this.j = this.j * a;
        this.k = this.k * a;
        return this;
    }

    div(a: number) {
        if (a == 0) {
            console.error("Cannot divide by 0.");
            return;
        }
        this.a = this.a / a;
        this.i = this.i / a;
        this.j = this.j / a;
        this.k = this.k / a;
        return this;
    }

    mag() {
        return Math.sqrt(this.a * this.a + this.i * this.i + this.j * this.j + this.k * this.k);
    }

    normalize() {
        return this.div(this.mag());
    }

    qRotate(q: Quaternion) {
        return this.quaternionRotate(q);
    }

    quaternionRotate(q: Quaternion) {
        let r = Quaternion.normalize(q).quaternionMult(this.normalize());
        this.a = r.a;
        this.i = r.i;
        this.j = r.j;
        this.k = r.k;
        return this;
    }

    qMult(q: Quaternion) {
        return this.quaternionMult(q);
    }

    quaternionMult(q: Quaternion) {
        let r = new Quaternion(
            this.a * q.a - this.i * q.i - this.j * q.j - this.k * q.k,
            this.a * q.i + this.i * q.a + this.j * q.k - this.k * q.j,
            this.a * q.j - this.i * q.k + this.j * q.a + this.k * q.i,
            this.a * q.k + this.i * q.j - this.j * q.i + this.k * q.a
        );

        this.a = r.a;
        this.i = r.i;
        this.j = r.j;
        this.k = r.k;

        return this;
    }

    rotateAxis(axis: number | Vector, angle: number) {
        let q = Quaternion.fromAxisRotation(axis, angle);
        return this.quaternionRotate(q);
    }

    rotateX(a: number) {
        return this.rotateAxis(Vector.X_AXIS, a);
    }

    rotateY(a: number) {
        return this.rotateAxis(Vector.Y_AXIS, a);
    }

    rotateZ(a: number) {
        return this.rotateAxis(Vector.Z_AXIS, a);
    }

    getRotationMatrix() {
        let a = this.a;
        let i = this.i;
        let j = this.j;
        let k = this.k;
        let M = [
            [
                (a * a + i * i - j * j - k * k),
                (2 * (i * j - a * k)),
                (2 * (a * j + i * k))
            ],
            [
                (2 * (i * j + a * k)),
                (a * a - i * i + j * j - k * k),
                (2 * (-a * i + j * k))
            ],
            [
                (2 * (-a * j + i * k)),
                (2 * (a * i + j * k)),
                (a * a - i * i - j * j + k * k)
            ]
        ];
        return M;
    }

    copy() {
        return new Quaternion(this.a, this.i, this.j, this.k);
    }

    static sub(q0: Quaternion, q1: Quaternion) {
        return q0.copy().sub(q1);
    }

    static add(q0: Quaternion, q1: Quaternion) {
        return q0.copy().add(q1);
    }

    static conjugate(q: Quaternion) {
        return q.copy().conjugate();
    }

    static mult(q: Quaternion, a: number) {
        return q.copy().mult(a);
    }

    static div(q: Quaternion, a: number) {
        return q.copy().div(a);
    }

    static mag(q: Quaternion) {
        return q.mag();
    }

    static normalize(q: Quaternion) {
        return q.copy().normalize();
    }

    static qMult(q0: Quaternion, q1: Quaternion) {
        return Quaternion.quaternionMult(q0, q1);
    }

    static quaternionMult(q0: Quaternion, q1: Quaternion) {
        return q0.copy().quaternionMult(q1);
    }

    static qRotate(q0: Quaternion, q1: Quaternion) {
        return this.quaternionRotate(q0, q1);
    }

    static quaternionRotate(q0: Quaternion, q1: Quaternion) {
        return q0.copy().quaternionRotate(q1);
    }

    static rotateAxis(q: Quaternion, axis: number | Vector, angle: number) {
        return q.copy().rotateAxis(axis, angle);
    }

    static rotateX(q: Quaternion, a: number) {
        return q.copy().rotateX(a);
    }

    static rotateY(q: Quaternion, a: number) {
        return q.copy().rotateY(a);
    }

    static rotateZ(q: Quaternion, a: number) {
        return q.copy().rotateZ(a);
    }

    static getRotationMatrix(q: Quaternion) {
        return q.getRotationMatrix();
    }

    static copy(q: Quaternion | { a: number, i: number, j: number, k: number }) {
        return new Quaternion(q.a, q.i, q.j, q.k);
    }

    static fromAxisRotation(axis: Vector | number, angle: number) {
        let a = Math.cos(angle / 2.0);
        let s = Math.sin(angle / 2.0);
        if (typeof axis === "number") {
            var i = (axis == Vector.X_AXIS ? s : 0);
            var j = (axis == Vector.Y_AXIS ? s : 0);
            var k = (axis == Vector.Z_AXIS ? s : 0);
        } else {
            axis = Vector.normalize(axis);
            var i = axis.x * s;
            var j = axis.y * s;
            var k = axis.z * s;
        }
        return (new Quaternion(a, i, j, k)).normalize();
    }

    static fromVector(v: Vector, reference = Vector.xAxis()) {
        if (v.equals(reference)) {
            // if vector is same as reference
            return new Quaternion(1, 0, 0, 0);
        }

        let origin = new Vector();

        if (Vector.neg(v).equals(reference)) {
            // If vector is 180 deg from reference
            let randomLine = Vector.add(reference, new Vector(1, 1, 1)).normalize();
            if (randomLine.equals(reference)) {
                randomLine = Vector.add(reference, new Vector(1, 1, 0)).normalize();
            }
            let trigon = new Trigon(origin, reference, randomLine);
            return Quaternion.fromAxisRotation(trigon.getNormal(), Math.PI);
        }

        let x_axis = Vector.axis(Vector.X_AXIS);
        let y_axis = Vector.axis(Vector.Y_AXIS);
        let z_axis = Vector.axis(Vector.Z_AXIS);
        let trigon = new Trigon(origin, reference, v);
        let normal = trigon.getNormal();
        let angle = reference.angleBetween(v);
        let angle_x = normal.angleBetween(x_axis);
        let angle_y = normal.angleBetween(y_axis);
        let angle_z = normal.angleBetween(z_axis);
        let sinHalfAngle = Math.sin(angle / 2);
        let quaternion = new Quaternion(
            Math.cos(angle / 2),
            Math.cos(angle_x) * sinHalfAngle,
            Math.cos(angle_y) * sinHalfAngle,
            Math.cos(angle_z) * sinHalfAngle
        );
        return quaternion.normalize();
    }
}