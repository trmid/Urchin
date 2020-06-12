/// <reference path="./Quaternion.ts" />

class Vector {
    static X_AXIS = 0;
    static Y_AXIS = 1;
    static Z_AXIS = 2;

    constructor(public x = 0, public y = 0, public z = 0) { }

    copy() {
        return new Vector(this.x, this.y, this.z);
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    add(a: number | Vector) {
        switch (typeof a) {
            case "number":
                this.x += a;
                this.y += a;
                this.z += a;
                return this;
            case "object":
                this.x += a.x;
                this.y += a.y;
                this.z += a.z;
                return this;
            default:
                console.error("Expected number or Vector, got " + (typeof a) + ".");
                return;
        }
    }

    addX(a: number) {
        this.x += a;
        return this;
    }

    addY(a: number) {
        this.y += a;
        return this;
    }

    addZ(a: number) {
        this.z += a;
        return this;
    }

    sub(a: number | Vector) {
        switch (typeof a) {
            case "number":
                this.x -= a;
                this.y -= a;
                this.z -= a;
                return this;
            case "object":
                this.x -= a.x;
                this.y -= a.y;
                this.z -= a.z;
                return this;
            default:
                console.error("Expected number or Vector, got " + (typeof a) + ".");
                return;
        }
    }

    subX(a: number) {
        this.x -= a;
        return this;
    }

    subY(a: number) {
        this.y -= a;
        return this;
    }

    subZ(a: number) {
        this.z -= a;
        return this;
    }

    div(a: number | Vector) {
        switch (typeof a) {
            case "number":
                if (a == 0) {
                    console.error("Can't divide by zero.");
                    return this;
                }
                this.x /= a;
                this.y /= a;
                this.z /= a;
                return this;
            case "object":
                if (a.x == 0 || a.y == 0 || a.z == 0) {
                    console.error("Can't divide by zero.");
                    return this;
                }
                this.x /= a.x;
                this.y /= a.y;
                this.z /= a.z;
                return this;
            default:
                console.error("Expected number or Vector, got " + (typeof a) + ".");
                return this;
        }
    }

    divX(a: number) {
        if (a == 0) {
            console.error("Can't divide by zero.");
            return;
        }
        this.x /= a;
        return this;
    }

    divY(a: number) {
        if (a == 0) {
            console.error("Can't divide by zero.");
            return;
        }
        this.y /= a;
        return this;
    }

    divZ(a: number) {
        if (a == 0) {
            console.error("Can't divide by zero.");
            return;
        }
        this.z /= a;
        return this;
    }

    normalize() {
        let mag = this.mag();
        if (mag == 0) {
            return this;
        }
        return this.div(mag);
    }

    mult(a: number | Vector) {
        switch (typeof a) {
            case "number":
                this.x *= a;
                this.y *= a;
                this.z *= a;
                return this;
            case "object":
                this.x *= a.x;
                this.y *= a.y;
                this.z *= a.z;
                return this;
            default:
                console.error("Expected number or Vector, got " + (typeof a) + ".");
                return;
        }
    }

    multX(a: number) {
        this.x *= a;
        return this;
    }

    multY(a: number) {
        this.y *= a;
        return this;
    }

    multZ(a: number) {
        this.z *= a;
        return this;
    }

    neg() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    cross(v: Vector) {
        let c = new Vector(
            this.y * v.z - this.z * v.y,
            -(this.x * v.z - this.z * v.x),
            this.x * v.y - this.y * v.x
        );
        this.x = c.x;
        this.y = c.y;
        this.z = c.z;
        return this;
    }

    dot(v: Vector) {
        return (this.x * v.x + this.y * v.y + this.z * v.z);
    }

    qRotate(q: Quaternion) {
        return this.quaternionRotate(q);
    }

    quaternionRotate(q: Quaternion) {
        q = q.normalize();
        let p = new Quaternion(0, this.x, this.y, this.z);
        let c = Quaternion.conjugate(q);
        p = Quaternion.qMult(q, p).qMult(c); // two quaternion multiplications with this vector as a quaternion with real part '0'
        this.x = p.i;
        this.y = p.j;
        this.z = p.k;
        return this;
    }

    transform(M: Array<Array<number>>) {
        let x = this.x * M[0][0] + this.y * M[0][1] + this.z * M[0][2] + (M[0][3] || 0);
        let y = this.x * M[1][0] + this.y * M[1][1] + this.z * M[1][2] + (M[1][3] || 0);
        let z = this.x * M[2][0] + this.y * M[2][1] + this.z * M[2][2] + (M[2][3] || 0);
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    rotateAxis(axis: number | Vector, angle: number) {
        return this.quaternionRotate(Quaternion.fromAxisRotation(axis, angle));
    }

    rotateX(xAngle: number) {
        return this.rotateAxis(Vector.X_AXIS, xAngle);
    }

    rotateY(yAngle: number) {
        return this.rotateAxis(Vector.Y_AXIS, yAngle);
    }

    rotateZ(zAngle: number) {
        return this.rotateAxis(Vector.Z_AXIS, zAngle);
    }

    angleBetween(v: Vector) {
        let denominator = (this.mag() * v.mag());
        if (denominator == 0) {
            return 0;
        }
        return Math.acos(Num.constrain(this.dot(v) / denominator, -1, 1));
    }

    equals(v: Vector) {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }

    closest(V: Array<Vector>) {
        if (V.length == 1) return V[0];
        let minIndex = 0, min;
        for (let i = 0; i < V.length; i++) {
            let dist = Vector.sub(V[i], this).mag();
            if (!min || dist < min) {
                min = dist;
                minIndex = i;
            }
        }
        return V[minIndex];
    }

    furthest(V: Array<Vector>) {
        if (V.length == 1) return V[0];
        let maxIndex = 0, max;
        for (let i = 0; i < V.length; i++) {
            let dist = Vector.sub(V[i], this).mag();
            if (!max || dist > max) {
                max = dist;
                maxIndex = i;
            }
        }
        return V[maxIndex];
    }

    static copy(v: Vector | { x: number, y: number, z: number }) {
        return new Vector(v.x, v.y, v.z);
    }

    static mag(v: Vector) {
        return v.mag();
    }

    static normalize(v: Vector) {
        return v.copy().normalize();
    }

    static add(v: Vector, a: number | Vector) {
        return v.copy().add(a);
    }

    static addX(v: Vector, a: number) {
        return v.copy().addX(a);
    }

    static addY(v: Vector, a: number) {
        return v.copy().addY(a);
    }

    static addZ(v: Vector, a: number) {
        return v.copy().addZ(a);
    }

    static sub(v: Vector, a: number | Vector) {
        return v.copy().sub(a);
    }

    static subX(v: Vector, a: number) {
        return v.copy().subX(a);
    }

    static subY(v: Vector, a: number) {
        return v.copy().subY(a);
    }

    static subZ(v: Vector, a: number) {
        return v.copy().subZ(a);
    }

    static div(v: Vector, a: number | Vector) {
        return v.copy().div(a);
    }

    static divX(v: Vector, a: number) {
        return v.copy().divX(a);
    }

    static divY(v: Vector, a: number) {
        return v.copy().divY(a);
    }

    static divZ(v: Vector, a: number) {
        return v.copy().divZ(a);
    }

    static mult(v: Vector, a: number | Vector) {
        return v.copy().mult(a);
    }

    static multX(v: Vector, a: number) {
        return v.copy().multX(a);
    }

    static multY(v: Vector, a: number) {
        return v.copy().multY(a);
    }

    static multZ(v: Vector, a: number) {
        return v.copy().multZ(a);
    }

    static neg(v: Vector) {
        return v.copy().neg();
    }

    static cross(v0: Vector, v1: Vector) {
        return v0.copy().cross(v1);
    }

    static dot(v0: Vector, v1: Vector) {
        return v0.dot(v1);
    }

    static qRotate(v: Vector, q: Quaternion) {
        return Vector.quaternionRotate(v, q);
    }

    static quaternionRotate(v: Vector, q: Quaternion) {
        return v.copy().quaternionRotate(q);
    }

    static transform(v: Vector, M: Array<Array<number>>) {
        return v.copy().transform(M);
    }

    static rotateAxis(v: Vector, axis: number | Vector, angle: number) {
        return v.copy().rotateAxis(axis, angle);
    }

    static rotateX(v: Vector, xAngle: number) {
        return v.copy().rotateX(xAngle);
    }

    static rotateY(v: Vector, yAngle: number) {
        return v.copy().rotateY(yAngle);
    }

    static rotateZ(v: Vector, zAngle: number) {
        return v.copy().rotateZ(zAngle);
    }

    static angleBetween(v0: Vector, v1: Vector) {
        return v0.angleBetween(v1);
    }

    static equals(v0: Vector, v1: Vector) {
        return v0.equals(v1);
    }

    static closest(v: Vector, V: Array<Vector>) {
        return v.closest(V);
    }

    static furthest(v: Vector, V: Array<Vector>) {
        return v.furthest(V);
    }

    static axis(a: number) {
        switch (a) {
            case Vector.X_AXIS: return new Vector(1, 0, 0);
            case Vector.Y_AXIS: return new Vector(0, 1, 0);
            case Vector.Z_AXIS: return new Vector(0, 0, 1);
        }
        console.error(`Axis [${a}] is not a valid axis number.`);
        return new Vector();
    }

    static xAxis() {
        return Vector.axis(Vector.X_AXIS);
    }

    static yAxis() {
        return Vector.axis(Vector.Y_AXIS);
    }

    static zAxis() {
        return Vector.axis(Vector.Z_AXIS);
    }
}